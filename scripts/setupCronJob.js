/**
 * Setup Cron Job for Weekly Cinema Movie Updates
 * Runs every Friday at 9:00 AM
 * 
 * This script should be run once to set up the cron job
 * Or integrate it into app.js to run automatically
 */

const cron = require('node-cron');
const { spawn } = require('child_process');
const path = require('path');

/**
 * Schedule cinema movie updates every Friday at 9:00 AM
 */
const scheduleCinemaUpdates = () => {
  // Cron expression: Every Friday at 9:00 AM
  // Format: minute hour day-of-month month day-of-week
  // 0 9 * * 5 = Friday at 9:00 AM
  cron.schedule('0 9 * * 5', () => {
    console.log('🔄 Starting scheduled cinema movie update...');
    console.log(`📅 Date: ${new Date().toISOString()}`);

    // Run the update script
    const scriptPath = path.join(__dirname, 'updateCinemaMovies.js');
    const child = spawn('node', [scriptPath], {
      stdio: 'inherit',
      shell: true
    });

    child.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Scheduled update completed successfully');
      } else {
        console.error(`❌ Scheduled update failed with code ${code}`);
      }
    });

    child.on('error', (error) => {
      console.error('❌ Error running scheduled update:', error);
    });
  }, {
    scheduled: true,
    timezone: 'Europe/Madrid' // Spanish timezone
  });

  console.log('✅ Cron job scheduled: Every Friday at 9:00 AM (Europe/Madrid)');
};

module.exports = scheduleCinemaUpdates;

// If run directly, set up the cron job
if (require.main === module) {
  scheduleCinemaUpdates();
  console.log('⏰ Cron job is now active. Press Ctrl+C to stop.');
  
  // Keep process alive
  process.on('SIGINT', () => {
    console.log('\n👋 Stopping cron job...');
    process.exit(0);
  });
}

