import { useState } from "react";

export default function BPSAnalyzerApp() {
  const [teamNumber, setTeamNumber] = useState("");
  const [teamConfirmed, setTeamConfirmed] = useState(false);

  const [uploadedVideo, setUploadedVideo] = useState(null);
  const [youtubeURL, setYoutubeURL] = useState("");

  const [analysisStatus, setAnalysisStatus] = useState("Waiting");

  const [teamDatabase, setTeamDatabase] = useState({});

  const [latestAnalysis, setLatestAnalysis] = useState(null);

  const analyzeMatch = async () => {
    if (!uploadedVideo && youtubeURL.trim() === "") {
      alert("Please upload a video or paste a YouTube URL.");
      return;
    }

    setAnalysisStatus("Downloading & Analyzing Match...");

    // FUTURE REAL IMPLEMENTATION:
    // If youtubeURL exists:
    // 1. Send URL to backend
    // 2. Backend downloads video using ytdl-core
    // 3. Extract frames using ffmpeg
    // 4. Analyze using OpenCV + YOLO
    //
    // If uploadedVideo exists:
    // 1. Upload directly to backend
    // 2. Process locally

    setTimeout(() => {
      const newAnalysis = {
        estimatedBPS: 1.07,
        hopperCapacity: 118,
        hopperEmptyTime: 6.2,
        shootingTime: 8.9,
        fuelPerSecond: 19.1,
      };

      setLatestAnalysis(newAnalysis);

      setTeamDatabase((prev) => {
        const existingTeam = prev[teamNumber] || {
          matches: 0,
          totalBPS: 0,
        };

        const updatedMatches = existingTeam.matches + 1;

        const updatedTotalBPS =
          existingTeam.totalBPS + newAnalysis.estimatedBPS;

        return {
          ...prev,
          [teamNumber]: {
            matches: updatedMatches,
            totalBPS: updatedTotalBPS,
            averageBPS: (
              updatedTotalBPS / updatedMatches
            ).toFixed(2),
          },
        };
      });

      setAnalysisStatus("Analysis Complete");
    }, 3000);
  };

  if (!teamConfirmed) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10 w-full max-w-xl shadow-2xl">
          <h1 className="text-5xl font-black text-center">
            BPS Analyzer
          </h1>

          <p className="text-zinc-400 text-center mt-4 text-lg">
            Enter a team number to begin scouting
          </p>

          <div className="mt-8 space-y-4">
            <input
              type="number"
              placeholder="Team Number"
              value={teamNumber}
              onChange={(e) => setTeamNumber(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-5 text-2xl outline-none focus:border-cyan-400"
            />

            <button
              onClick={() => {
                if (teamNumber.trim() !== "") {
                  setTeamConfirmed(true);
                }
              }}
              className="w-full bg-cyan-500 hover:bg-cyan-400 transition rounded-2xl py-5 text-black font-black text-2xl"
            >
              Start Scouting
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* HEADER */}

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-5xl font-black tracking-tight">
              Team {teamNumber}
            </h1>

            <p className="text-zinc-400 mt-2 text-lg">
              AI-powered FRC scouting analytics
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4">
            <p className="text-zinc-400 text-sm">
              Analyzer Status
            </p>

            <h2 className="text-2xl font-bold text-cyan-400 mt-1">
              {analysisStatus}
            </h2>
          </div>
        </div>

        {/* VIDEO ANALYZER */}

        <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-6">
          <h2 className="text-3xl font-black">
            AI Match Video Analyzer
          </h2>

          <p className="text-zinc-400 mt-2">
            Upload a match video OR paste a YouTube URL
            for automatic AI analysis.
          </p>

          <div className="grid grid-cols-1 gap-4 mt-6">
            {/* YOUTUBE URL */}

            <input
              type="text"
              placeholder="Paste YouTube Match URL"
              value={youtubeURL}
              onChange={(e) => setYoutubeURL(e.target.value)}
              className="bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 outline-none focus:border-cyan-400"
            />

            {/* FILE UPLOAD */}

            <input
              type="file"
              accept="video/*"
              className="bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4"
              onChange={(e) => setUploadedVideo(e.target.files[0])}
            />

            {/* ANALYZE BUTTON */}

            <button
              onClick={analyzeMatch}
              className="bg-cyan-500 hover:bg-cyan-400 transition rounded-2xl py-5 text-black font-black text-xl"
            >
              Analyze Match
            </button>
          </div>

          {/* FEATURES */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6 text-sm">
            <div className="bg-zinc-950 rounded-xl p-4 border border-zinc-800">
              • Automatic BPS calculation
            </div>

            <div className="bg-zinc-950 rounded-xl p-4 border border-zinc-800">
              • Fuel counting
            </div>

            <div className="bg-zinc-950 rounded-xl p-4 border border-zinc-800">
              • Hopper capacity estimation
            </div>

            <div className="bg-zinc-950 rounded-xl p-4 border border-zinc-800">
              • Shooting duration tracking
            </div>

            <div className="bg-zinc-950 rounded-xl p-4 border border-zinc-800">
              • AI cycle timing analysis
            </div>

            <div className="bg-zinc-950 rounded-xl p-4 border border-zinc-800">
              • Historical BPS averaging
            </div>
          </div>
        </div>

        {/* ANALYTICS */}

        {latestAnalysis && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-5">
              <p className="text-zinc-400 text-sm">
                Estimated BPS
              </p>

              <h2 className="text-4xl font-black mt-2 text-cyan-400">
                {latestAnalysis.estimatedBPS}
              </h2>
            </div>

            <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-5">
              <p className="text-zinc-400 text-sm">
                Hopper Capacity
              </p>

              <h2 className="text-4xl font-black mt-2 text-cyan-400">
                {latestAnalysis.hopperCapacity}
              </h2>
            </div>

            <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-5">
              <p className="text-zinc-400 text-sm">
                Empty Time
              </p>

              <h2 className="text-4xl font-black mt-2 text-cyan-400">
                {latestAnalysis.hopperEmptyTime}s
              </h2>
            </div>

            <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-5">
              <p className="text-zinc-400 text-sm">
                Shooting Time
              </p>

              <h2 className="text-4xl font-black mt-2 text-cyan-400">
                {latestAnalysis.shootingTime}s
              </h2>
            </div>

            <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-5">
              <p className="text-zinc-400 text-sm">
                Fuel / Second
              </p>

              <h2 className="text-4xl font-black mt-2 text-cyan-400">
                {latestAnalysis.fuelPerSecond}
              </h2>
            </div>
          </div>
        )}

        {/* DATABASE */}

        <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-6">
          <h2 className="text-3xl font-black">
            Team Database
          </h2>

          <div className="mt-6 space-y-4">
            {Object.entries(teamDatabase).map(([team, data]) => (
              <div
                key={team}
                className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-3xl font-black text-cyan-400">
                    Team {team}
                  </h3>

                  <div className="text-right">
                    <p className="text-zinc-400 text-sm">
                      Average BPS
                    </p>

                    <p className="text-2xl font-black">
                      {data.averageBPS}
                    </p>
                  </div>
                </div>

                <p className="text-zinc-500 mt-3">
                  Matches Stored: {data.matches}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}