import { useState } from "react";

export default function Rebuilt2026Analyzer() {
  // =========================================
  // CONFIG
  // =========================================

  const TBA_API_KEY = "PASTE_YOUR_TBA_API_KEY_HERE";

  // =========================================
  // STATE
  // =========================================

  const [teamNumber, setTeamNumber] =
    useState("");

  const [teamConfirmed, setTeamConfirmed] =
    useState(false);

  const [analysisStatus, setAnalysisStatus] =
    useState("Waiting");

  const [youtubeURL, setYoutubeURL] =
    useState("");

  const [uploadedVideo, setUploadedVideo] =
    useState(null);

  const [teamInfo, setTeamInfo] = useState({
    nickname: "",
    city: "",
    rookieYear: "",
    logo: "",
    robotImage: "",
  });

  const [latestAnalysis, setLatestAnalysis] =
    useState(null);

  const [teamDatabase, setTeamDatabase] =
    useState({});

  // =========================================
  // FETCH TEAM DATA
  // =========================================

  const fetchTeamInfo = async (team) => {
    try {
      setAnalysisStatus(
        "Fetching Team Data..."
      );

      // =====================================
      // TEAM INFO
      // =====================================

      const response = await fetch(
        `https://www.thebluealliance.com/api/v3/team/frc${team}`,
        {
          method: "GET",

          headers: {
            "X-TBA-Auth-Key":
              TBA_API_KEY,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `TBA Error ${response.status}`
        );
      }

      const data = await response.json();

      // =====================================
      // TEAM MEDIA
      // =====================================

      let logoURL = "";
      let robotImage = "";

      try {
        const mediaResponse =
          await fetch(
            `https://www.thebluealliance.com/api/v3/team/frc${team}/media/2026`,
            {
              method: "GET",

              headers: {
                "X-TBA-Auth-Key":
                  TBA_API_KEY,
              },
            }
          );

        const mediaData =
          await mediaResponse.json();

        if (
          Array.isArray(mediaData)
        ) {
          // AVATAR

          const avatar =
            mediaData.find(
              (item) =>
                item.type === "avatar"
            );

          if (avatar) {
            logoURL =
              avatar.direct_url ||
              "";
          }

          // ROBOT IMAGE

          const robot =
            mediaData.find(
              (item) =>
                item.type ===
                  "imgur" ||
                item.type ===
                  "instagram-image" ||
                item.type ===
                  "cdphotothread"
            );

          if (robot) {
            // IMGUR

            if (
              robot.type ===
              "imgur"
            ) {
              robotImage = `https://i.imgur.com/${robot.foreign_key}.jpg`;
            }

            // INSTAGRAM

            else if (
              robot.type ===
              "instagram-image"
            ) {
              robotImage =
                robot.direct_url ||
                robot.view_url;
            }

            // CHIEF DELPHI PHOTO THREAD

            else if (
              robot.type ===
              "cdphotothread"
            ) {
              robotImage =
                robot.image_partial ||
                robot.view_url;
            }
          }
        }
      } catch (mediaError) {
        console.log(
          "Media Error:",
          mediaError
        );
      }

      // =====================================
      // SAVE TEAM INFO
      // =====================================

      setTeamInfo({
        nickname:
          data.nickname ||
          "Unknown Team",

        city: data.city || "",

        rookieYear:
          data.rookie_year || "",

        logo:
          logoURL ||
          "https://upload.wikimedia.org/wikipedia/commons/3/3f/Fronteira.svg",

        robotImage:
          robotImage ||
          "https://upload.wikimedia.org/wikipedia/commons/8/89/HD_transparent_picture.png",
      });

      setAnalysisStatus("Ready");
    } catch (error) {
      console.error(error);

      setAnalysisStatus(
        "TBA API Error"
      );

      alert(
        "Failed to load team data."
      );
    }
  };

  // =========================================
  // REAL AI VIDEO ANALYSIS
  // =========================================

  const analyzeMatch = async () => {
    try {
      if (
        !uploadedVideo &&
        youtubeURL.trim() === ""
      ) {
        alert(
          "Upload a video or paste a YouTube URL."
        );

        return;
      }

      setAnalysisStatus(
        "Analyzing Match..."
      );

      // =====================================
      // SEND VIDEO TO PYTHON AI BACKEND
      // =====================================

      const response = await fetch(
        "http://127.0.0.1:5000/analyze",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            youtubeURL,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Backend AI server failed."
        );
      }

      const data =
        await response.json();

      console.log(
        "AI ANALYSIS:",
        data
      );

      // =====================================
      // UPDATE UI
      // =====================================

      setLatestAnalysis(data);

      // =====================================
      // SAVE TEAM DATABASE
      // =====================================

      setTeamDatabase(
        (prev) => {
          const existing =
            prev[teamNumber] || {
              matches: 0,

              totalBPS: 0,

              bestBPS: 0,

              bestHopper: 0,
            };

          const matches =
            existing.matches + 1;

          const totalBPS =
            existing.totalBPS +
            data.avgBPS;

          const avgBPS =
            totalBPS / matches;

          const bestBPS =
            Math.max(
              existing.bestBPS,
              data.maxBPS
            );

          const bestHopper =
            Math.max(
              existing.bestHopper,
              data.maxHopperCapacity
            );

          return {
            ...prev,

            [teamNumber]: {
              matches,

              avgBPS:
                avgBPS.toFixed(1),

              bestBPS:
                bestBPS.toFixed(1),

              bestHopper,
            },
          };
        }
      );

      setAnalysisStatus(
        "Analysis Complete"
      );
    } catch (error) {
      console.error(error);

      setAnalysisStatus(
        "Analysis Failed"
      );

      alert(
        "Could not connect to AI backend."
      );
    }
  };

  // =========================================
  // START SCREEN
  // =========================================

  if (!teamConfirmed) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-6">

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10 w-full max-w-xl shadow-2xl">

          <h1 className="text-5xl font-black text-center">
            2026 Rebuilt Analyzer
          </h1>

          <p className="text-zinc-400 text-center mt-4 text-lg">
            AI-Powered FRC Scouting
          </p>

          <div className="mt-8 space-y-4">

            <input
              type="number"
              placeholder="Enter Team Number"
              value={teamNumber}
              onChange={(e) =>
                setTeamNumber(
                  e.target.value
                )
              }
              className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-5 text-2xl outline-none focus:border-cyan-400"
            />

            <button
              onClick={async () => {
                if (
                  teamNumber.trim() !==
                  ""
                ) {
                  await fetchTeamInfo(
                    teamNumber
                  );

                  setTeamConfirmed(
                    true
                  );
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

  // =========================================
  // MAIN APP
  // =========================================

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">

      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER */}

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">

          <div className="flex flex-col lg:flex-row gap-6 items-center">

            {/* TEAM LOGO */}

            <img
              src={teamInfo.logo}
              alt="Team Logo"
              onError={(e) => {
                e.target.src =
                  "https://upload.wikimedia.org/wikipedia/commons/3/3f/Fronteira.svg";
              }}
              className="w-32 h-32 rounded-2xl object-cover border border-zinc-700"
            />

            {/* TEAM INFO */}

            <div>
              <h1 className="text-5xl font-black">
                Team {teamNumber}
              </h1>

              <h2 className="text-3xl font-bold text-cyan-400 mt-2">
                {
                  teamInfo.nickname
                }
              </h2>

              <p className="text-zinc-400 mt-3">
                {teamInfo.city}
              </p>

              <p className="text-zinc-500">
                Rookie Year:{" "}
                {
                  teamInfo.rookieYear
                }
              </p>
            </div>

            {/* STATUS */}

            <div className="lg:ml-auto bg-zinc-950 border border-zinc-800 rounded-2xl px-6 py-4">

              <p className="text-zinc-400 text-sm">
                Status
              </p>

              <h2 className="text-2xl font-bold text-cyan-400 mt-1">
                {
                  analysisStatus
                }
              </h2>
            </div>
          </div>
        </div>

        {/* ROBOT IMAGE */}

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">

          <h2 className="text-3xl font-black">
            Robot Image
          </h2>

          <img
            src={
              teamInfo.robotImage
            }
            alt="Robot"
            onError={(e) => {
              e.target.src =
                "https://upload.wikimedia.org/wikipedia/commons/8/89/HD_transparent_picture.png";
            }}
            className="mt-5 rounded-2xl border border-zinc-800 max-h-[500px] w-full object-cover"
          />
        </div>

        {/* VIDEO ANALYZER */}

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">

          <h2 className="text-3xl font-black">
            AI Match Analyzer
          </h2>

          <div className="grid grid-cols-1 gap-4 mt-6">

            <input
              type="text"
              placeholder="Paste YouTube Match URL"
              value={youtubeURL}
              onChange={(e) =>
                setYoutubeURL(
                  e.target.value
                )
              }
              className="bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 outline-none focus:border-cyan-400"
            />

            <input
              type="file"
              accept="video/*"
              onChange={(e) =>
                setUploadedVideo(
                  e.target.files[0]
                )
              }
              className="bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4"
            />

            <button
              onClick={
                analyzeMatch
              }
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

              <StatCard
                title="Avg BPS"
                value={
                  latestAnalysis.avgBPS
                }
              />

              <StatCard
                title="Peak BPS"
                value={
                  latestAnalysis.peakBPS
                }
              />

              <StatCard
                title="Max BPS"
                value={
                  latestAnalysis.maxBPS
                }
              />

              <StatCard
                title="Hopper Capacity"
                value={
                  latestAnalysis.hopperCapacity
                }
              />

              <StatCard
                title="Max Hopper"
                value={
                  latestAnalysis.maxHopperCapacity
                }
              />

              <StatCard
                title="Avg Shooting Time"
                value={`${latestAnalysis.avgShootingTime}s`}
              />

              <StatCard
                title="Avg Accuracy"
                value={`${latestAnalysis.avgAccuracy}%`}
              />

              <StatCard
                title="Avg Cycle Time"
                value={`${latestAnalysis.avgCycleTime}s`}
              />

              <StatCard
                title="Auto Cycles"
                value={
                  latestAnalysis.autoCycles
                }
              />

              <StatCard
                title="Teleop Cycles"
                value={
                  latestAnalysis.teleopCycles
                }
              />

              <StatCard
                title="Avg Auto Fuel"
                value={
                  latestAnalysis.avgAutoFuel
                }
              />

              <StatCard
                title="Avg Teleop Fuel"
                value={
                  latestAnalysis.avgTeleopFuel
                }
              />

              <StatCard
                title="Climb Success"
                value={`${latestAnalysis.climbSuccess}%`}
              />
            </div>

            {/* TEAM DATABASE */}

            <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-6">

              <h2 className="text-3xl font-black">
                Team Database
              </h2>

              <div className="mt-6 space-y-4">

                {Object.entries(
                  teamDatabase
                ).map(
                  (
                    [team, data]
                  ) => (
                    <div
                      key={team}
                      className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5"
                    >
                      <div className="flex justify-between items-center">

                        <h3 className="text-3xl font-black text-cyan-400">
                          Team {team}
                        </h3>

                        <div className="text-right">

                          <p className="text-zinc-400 text-sm">
                            Avg BPS
                          </p>

                          <p className="text-2xl font-black">
                            {
                              data.avgBPS
                            }
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-between mt-4 text-sm text-zinc-400">

                        <p>
                          Matches:{" "}
                          {
                            data.matches
                          }
                        </p>

                        <p>
                          Best BPS:{" "}
                          {
                            data.bestBPS
                          }
                        </p>

                        <p>
                          Max Hopper:{" "}
                          {
                            data.bestHopper
                          }
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// =========================================
// STAT CARD COMPONENT
// =========================================

function StatCard({
  title,
  value,
}) {
  return (
    <div className="bg-zinc-900 rounded-3xl p-5 border border-zinc-800">

      <p className="text-zinc-400 text-sm">
        {title}
      </p>

      <h2 className="text-4xl font-black mt-2 text-cyan-400">
        {value}
      </h2>
    </div>
  );
}
