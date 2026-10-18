import { prisma } from '@crm/database';
import { processFollowupTask } from '../processors/followup.processor.js';
export async function runTaskReconciler() {
  try {
    const now = new Date();

    // Find due tasks that are still pending
    const dueTasks = await prisma.followupTask.findMany({
      where: {
        status: 'pending',
        dueAt: {
          lte: now
        }
      },
      take: 25
    });
    if (dueTasks.length > 0) {
      console.log(`[RECONCILER] Found ${dueTasks.length} due follow-up tasks to process`);
      for (const task of dueTasks) {
        try {
          await processFollowupTask(task.id);
        } catch (taskErr) {
          console.error(`[RECONCILER] Error processing task ${task.id}:`, taskErr);
        }
      }
    }
  } catch (err) {
    console.error('[RECONCILER] Error running reconciler cycle:', err);
  }
}
export function startReconcilerSchedule(intervalMs = 30000) {
  console.log(`[WORKER] Starting durable reconciler schedule (polling every ${intervalMs / 1000}s)`);
  runTaskReconciler();
  return setInterval(runTaskReconciler, intervalMs);
}