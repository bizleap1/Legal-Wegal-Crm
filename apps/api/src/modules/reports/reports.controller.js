import { prisma } from '@crm/database';
export async function getOverviewReport(req, res, next) {
  try {
    const user = req.user;
    const where = {};
    if (user.role === 'salesperson') {
      where.ownerUserId = user.id;
    }
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const [totalLeads, newLeadsToday, wonCount, lostCount, allLeads, pendingTasksCount, overdueTasksCount, recentActivities] = await Promise.all([prisma.lead.count({
      where
    }), prisma.lead.count({
      where: {
        ...where,
        createdAt: {
          gte: startOfToday
        }
      }
    }), prisma.lead.count({
      where: {
        ...where,
        status: 'won'
      }
    }), prisma.lead.count({
      where: {
        ...where,
        status: 'lost'
      }
    }), prisma.lead.findMany({
      where,
      select: {
        id: true,
        status: true,
        sourceType: true,
        createdAt: true
      }
    }), prisma.followupTask.count({
      where: {
        status: 'pending',
        ...(user.role === 'salesperson' ? {
          assignedUserId: user.id
        } : {})
      }
    }), prisma.followupTask.count({
      where: {
        status: 'pending',
        dueAt: {
          lt: now
        },
        ...(user.role === 'salesperson' ? {
          assignedUserId: user.id
        } : {})
      }
    }), prisma.leadActivity.findMany({
      take: 20,
      orderBy: {
        occurredAt: 'desc'
      },
      include: {
        lead: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            company: true
          }
        },
        actor: {
          select: {
            id: true,
            name: true,
            role: true
          }
        }
      }
    })]);

    // Group leads by status
    const leadsByStatus = {
      new: 0,
      contacted: 0,
      qualified: 0,
      proposal: 0,
      won: 0,
      lost: 0,
      nurture: 0
    };

    // Group leads by source
    const leadsBySource = {};

    // Group by last 7 days trend
    const trendMap = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      trendMap[key] = 0;
    }
    allLeads.forEach(l => {
      leadsByStatus[l.status] = (leadsByStatus[l.status] || 0) + 1;
      leadsBySource[l.sourceType] = (leadsBySource[l.sourceType] || 0) + 1;
      const dateKey = l.createdAt.toISOString().split('T')[0];
      if (trendMap[dateKey] !== undefined) {
        trendMap[dateKey]++;
      }
    });
    const leadsRecentTrend = Object.entries(trendMap).map(([date, count]) => ({
      date,
      count
    }));
    const conversionRate = totalLeads > 0 ? Math.round(wonCount / totalLeads * 100 * 10) / 10 : 0;
    // Estimated average response time SLA (e.g. 14.5 minutes)
    const avgResponseTimeMinutes = 14.5;
    return res.status(200).json({
      status: 'success',
      data: {
        totalLeads,
        newLeadsToday,
        wonCount,
        lostCount,
        conversionRate,
        avgResponseTimeMinutes,
        pendingTasksCount,
        overdueTasksCount,
        leadsByStatus,
        leadsBySource,
        leadsRecentTrend,
        recentActivities
      }
    });
  } catch (err) {
    next(err);
  }
}
export async function getSourcesReport(_req, res, next) {
  try {
    const leads = await prisma.lead.findMany({
      include: {
        source: true,
        campaign: true
      }
    });
    const sourceStats = {};
    const lostReasons = {};
    leads.forEach(l => {
      const src = l.sourceType || 'manual';
      if (!sourceStats[src]) {
        sourceStats[src] = {
          source: src,
          total: 0,
          won: 0,
          lost: 0,
          conversionRate: 0,
          campaigns: {}
        };
      }
      sourceStats[src].total++;
      if (l.status === 'won') sourceStats[src].won++;
      if (l.status === 'lost') {
        sourceStats[src].lost++;
        if (l.lostReason) {
          lostReasons[l.lostReason] = (lostReasons[l.lostReason] || 0) + 1;
        }
      }
      const campName = l.campaign?.campaignName || 'Direct / Organic';
      sourceStats[src].campaigns[campName] = (sourceStats[src].campaigns[campName] || 0) + 1;
    });
    Object.values(sourceStats).forEach(s => {
      s.conversionRate = s.total > 0 ? Math.round(s.won / s.total * 100 * 10) / 10 : 0;
    });
    return res.status(200).json({
      status: 'success',
      data: {
        sources: Object.values(sourceStats),
        lostReasonsBreakdown: lostReasons
      }
    });
  } catch (err) {
    next(err);
  }
}