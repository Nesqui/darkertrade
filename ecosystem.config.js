module.exports = {
  apps: [{
    name: "be",
    cwd: "/opt/darkertrade/backend/dist/",
    script: "pnpm",
    args: "run start",
    instances: 1,
    autorestart: true,
    watch: false,
    error_file: "/opt/darkertrade/logs/backend-err.log",
    out_file: "/opt/darkertrade/logs/backend-out.log"
  },
  {
    name: "fe",
    cwd: "/opt/darkertrade/frontend/",
    script: "pnpm",
    args: "run build",
    instances: 1,
    error_file: "/opt/darkertrade/logs/frontend-err.log",
    out_file: "/opt/darkertrade/logs/frontend-out.log"
  }]
}
