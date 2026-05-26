import { useEffect, useState } from "react";

export default function BPSAnalyzerApp() {
  const [teamNumber, setTeamNumber] = useState("");
  const [teamConfirmed, setTeamConfirmed] = useState(false);

  const [teamInfo, setTeamInfo] = useState({
    nickname: "",
    logo: "",
  });

  const [uploadedVideo, setUploadedVideo] = useState(null);
  const [youtubeURL, setYoutubeURL] = useState("");

  const [analysisStatus, setAnalysisStatus] = useState("Waiting");

  const [teamDatabase, setTeamDatabase] = useState({});

  const [latestAnalysis, setLatestAnalysis] = useState(null);

  // AUTOMATIC TEAM LOOKUP
  // REAL IMPLEMENTATION:
  // Use The Blue Alliance API:
  // https://www.thebluealliance.com/apidocs

  const fetchTeamInfo = async (team) => {
    setAnalysisStatus("Fetching Team Data...");

    // MOCK TEAM DATA
    // Replace later with TBA API

    const mockTeams = {
      254: {
        nickname: "The Cheesy Poofs",
        logo:
          "https://upload.wikimedia.org/wikipedia/en/7/7a/254_Cheesy_Poofs.png",
      },

      1678: {
        nickname: "Citrus Circuits",
        logo:
          "https://upload.wikimedia.org/wikipedia/en/f/f0/Citrus_Circuits_Logo.png",
      },

      4414: {
        nickname: "HighTide",
        logo:
          "https://upload.wikimedia.org/wikipedia/en/5/55/HighTide_4414.png",
      },
    };

    setTimeout(() => {
      if (mockTeams[team]) {
        setTeamInfo(mockTeams[team]);
      } else {
        setTeamInfo({
          nickname: "Unknown Team",
          logo:
            "https://upload.wikimedia.org/wikipedia/commons/3/3f/Fronteira.svg",
        });
      }

      setAnalysisStatus("Waiting");
    }, 1000);
  };

  const analyzeMatch = async () => {
    if (!uploadedVideo && youtubeURL.trim() === "") {
      alert("Please upload a video or paste a YouTube URL.");
      return;
    }

    setAnalysisStatus("Downloading & Analyzing Match...");

    setTimeout(() => {
      const newAnalysis = {
        hopperCapacity: 78,

        shootingTime: 5.1,

        estimatedBPS: 15.3,

        peakBPS: 17.8,

        firingConsistency: 92,

        shotAccuracy: 84,

        cycleTime: 13.2,

        autoFuel: 18,

        teleopFuel: 60,

        climbSuccess: true,
      };

      setLatestAnalysis(newAnalysis);

      setTeamDatabase((prev) => {
        const existingTeam = prev[teamNumber] || {
          matches: 0,
          totalBPS: 0,
          bestBPS: 0,
        };

        const updatedMatches = existingTeam.matches + 1;

        const updatedTotalBPS =
          existingTeam.totalBPS + newAnalysis.estimatedBPS;

        const updatedAverageBPS =
          updatedTotalBPS / updatedMatches;

        const updatedBestBPS = Math.max(
          existingTeam.bestBPS,
          newAnalysis.estimatedBPS
        );

        return {
          ...prev,
          [teamNumber]: {
            matches: updatedMatches,
            totalBPS: updatedTotalBPS,
            averageBPS: updatedAverageBPS.toFixed(1),
            bestBPS: updatedBestBPS.toFixed(1),
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
            Steamworks BPS Analyzer
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
              onClick={async () => {
                if (teamNumber.trim() !== "") {
                  await fetchTeamInfo(teamNumber);

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

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
          <div className="flex flex-col lg:flex-row items-center gap-6">
            {/* TEAM LOGO */}

            <img
              src={teamInfo.logo}
              alt="Team Logo"
              className="w-32 h-32 rounded-2xl object-cover border border-zinc-700"
            />

            {/* TEAM INFO */}

            <div>
              <h1 className="text-5xl font-black">
                Team {teamNumber}
              </h1>

              <h2 className="text-3xl font-bold text-cyan-400 mt-2">
                {teamInfo.nickname}
              </h2>

              <p className="text-zinc-400 mt-3 text-lg">
                AI-powered Steamworks scouting analytics
              </p>
            </div>

            {/* STATUS */}

            <div className="lg:ml-auto bg-zinc-950 border border-zinc-800 rounded-2xl px-6 py-4">
              <p className="text-zinc-400 text-sm">
                Analyzer Status
              </p>

              <h2 className="text-2xl font-bold text-cyan-400 mt-1">
                {analysisStatus}
              </h2>
            </div>
          </div>
        </div>

        {/* VIDEO ANALYZER */}

        <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-6">
          <h2 className="text-3xl font-black">
            AI Match Video Analyzer
          </h2>

          <p className="text-zinc-400 mt-2">
            Upload a match recording OR paste a YouTube
            URL for automatic Steamworks shooter analysis.
          </p>

          <div className="grid grid-cols-1 gap-4 mt-6">
            <input
              type="text"
              placeholder="Paste YouTube Match URL"
              value={youtubeURL}
              onChange={(e) => setYoutubeURL(e.target.value)}
              className="bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 outline-none focus:border-cyan-400"
            />

            <input
              type="file"
              accept="video/*"
              className="bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4"
              onChange={(e) => setUploadedVideo(e.target.files[0])}
            />

            <button
              onClick={analyzeMatch}
              className="bg-cyan-500 hover:bg-cyan-400 transition rounded-2xl py-5 text-black font-black text-xl"
            >
              Analyze Match
            </button>
          </div>
        </div>

        {/* ANALYTICS */}

        {latestAnalysis && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-5">
                <p className="text-zinc-400 text-sm">
                  Sustained BPS
                </p>

                <h2 className="text-4xl font-black mt-2 text-cyan-400">
                  {latestAnalysis.estimatedBPS}
                </h2>
              </div>

              <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-5">
                <p className="text-zinc-400 text-sm">
                  Peak BPS
                </p>

                <h2 className="text-4xl font-black mt-2 text-cyan-400">
                  {latestAnalysis.peakBPS}
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
                  Shooting Time
                </p>

                <h2 className="text-4xl font-black mt-2 text-cyan-400">
                  {latestAnalysis.shootingTime}s
                </h2>
              </div>

              <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-5">
                <p className="text-zinc-400 text-sm">
                  Shot Accuracy
                </p>

                <h2 className="text-4xl font-black mt-2 text-cyan-400">
                  {latestAnalysis.shotAccuracy}%
                </h2>
              </div>
            </div>

            {/* ADVANCED METRICS */}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-5">
                <p className="text-zinc-400 text-sm">
                  Firing Consistency
                </p>

                <h2 className="text-4xl font-black mt-2 text-cyan-400">
                  {latestAnalysis.firingConsistency}%
                </h2>
              </div>

              <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-5">
                <p className="text-zinc-400 text-sm">
                  Cycle Time
                </p>

                <h2 className="text-4xl font-black mt-2 text-cyan-400">
                  {latestAnalysis.cycleTime}s
                </h2>
              </div>

              <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-5">
                <p className="text-zinc-400 text-sm">
                  Auto Fuel
                </p>

                <h2 className="text-4xl font-black mt-2 text-cyan-400">
                  {latestAnalysis.autoFuel}
                </h2>
              </div>

              <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-5">
                <p className="text-zinc-400 text-sm">
                  Teleop Fuel
                </p>

                <h2 className="text-4xl font-black mt-2 text-cyan-400">
                  {latestAnalysis.teleopFuel}
                </h2>
              </div>
            </div>
          </>
        )}

        {/* TEAM DATABASE */}

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

                <div className="flex justify-between mt-4 text-sm text-zinc-400">
                  <p>
                    Matches Stored: {data.matches}
                  </p>

                  <p>
                    Best BPS: {data.bestBPS}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
