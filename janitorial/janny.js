const { identifyDuplicateEmails, reassociateDuplicateUsers } = require('./identifyDuplicates');

async function runJanitorTasks() {
  try {
    console.log('Starting identification of duplicate emails...');
    await identifyDuplicateEmails();
    
    console.log('Starting reassociation of duplicate users...');
    await reassociateDuplicateUsers();
    
    console.log('All janitorial tasks completed successfully.');
  } catch (error) {
    console.error('Error running janitorial tasks:', error);
  }
}

runJanitorTasks();
