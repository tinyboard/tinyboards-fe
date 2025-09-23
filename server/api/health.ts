// Health check endpoint for Docker containers
export default defineEventHandler((event) => {
  return {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    pid: process.pid,
    version: process.env.npm_package_version || 'unknown'
  }
})