module.exports = {
  apps: [
    {
      name: 'prod-gembrs-server',
      script: 'dist/main.js',
      instances: 1,
      max_memory_restart: '300M',
      exp_backoff_restart_delay: 100,
    },
    {
      name: 'staging-gembrs-server',
      script: 'dist/main.js',
      instances: 1,
      max_memory_restart: '300M',
      exp_backoff_restart_delay: 100,
    },
  ],
};
