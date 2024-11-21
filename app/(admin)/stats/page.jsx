import os from "os";

export default function StatsPage() {
  const systemStats = {
    uptime: os.uptime(),
    totalMemory: os.totalmem(),
    freeMemory: os.freemem(),
    loadAverage: os.loadavg(),
    cpus: os.cpus(),
    networkInterfaces: os.networkInterfaces(),
    platform: os.platform(),
    release: os.release(),
    hostname: os.hostname(),
    arch: os.arch(),
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-center text-3xl text-blue-600 mb-8">
        Admin Panel - System Stats
      </h1>
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="font-semibold">Uptime:</span>
            <span>{(systemStats.uptime / 60).toFixed(2)} minutes</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Total Memory:</span>
            <span>{(systemStats.totalMemory / 1024 ** 3).toFixed(2)} GB</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Free Memory:</span>
            <span>{(systemStats.freeMemory / 1024 ** 3).toFixed(2)} GB</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Load Average (1 min):</span>
            <span>{systemStats.loadAverage[0]}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Platform:</span>
            <span>{systemStats.platform}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Release:</span>
            <span>{systemStats.release}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Hostname:</span>
            <span>{systemStats.hostname}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Architecture:</span>
            <span>{systemStats.arch}</span>
          </div>

          <div>
            <span className="font-semibold">CPU Info:</span>
            <ul className="ml-4 space-y-2">
              {systemStats.cpus.map((cpu, index) => (
                <li key={index}>
                  CPU {index + 1}: {cpu.model} - {cpu.speed} MHz
                </li>
              ))}
            </ul>
          </div>

          <div>
            <span className="font-semibold">Network Interfaces:</span>
            <ul className="ml-4 space-y-2">
              {Object.entries(systemStats.networkInterfaces).map(
                ([iface, details], index) => (
                  <li key={index}>
                    {iface}: {JSON.stringify(details)}
                  </li>
                )
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
