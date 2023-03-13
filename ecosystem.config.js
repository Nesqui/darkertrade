module.exports = {
  apps: [{
    name: 'be',
    cwd: '/opt/darkertrade/backend/',
    "script": "nest",
    "args": "start",
    instances: 1,
    autorestart: true,
    watch: false,
    error_file: '../logs/backend-err.log',
    out_file: '../logs/backend-out.log'
  },
  {
    name: 'fe',
    cwd: '/opt/darkertrade/frontend/',
    "script": "pnpm",
    "args": "run build",
    instances: 1,
    error_file: '../logs/frontend-err.log',
    out_file: '../logs/frontend-out.log'
  }]
}
