import { NextRequest, NextResponse } from "next/server";
import adminDb from "@/firebase/firebaseAdmin";

export async function POST(req: NextRequest) {
  try {
    if (!adminDb) {
      throw new Error("Firebase Admin Database is not initialized");
    }

    const body = await req.json();
    const { teamRed, teamBlue } = body;

    if (!teamRed || !teamBlue) {
      return NextResponse.json({ error: "Invalid input data" }, { status: 400 });
    }

    const sessionsRef = adminDb.ref("sessions");
    const newSessionRef = sessionsRef.push();
    const sessionId = newSessionRef.key;

    if (!sessionId) {
      throw new Error("Session ID creation failed");
    }

    // 모든 데이터를 한 번에 저장
    const initialSessionData = {
      phase: "waiting",
      turn: 0,
      teams: {
        red: {
          name: teamRed,
          players: [
            { key: "8", nickname: "", connected: false },
            { key: "9", nickname: "", connected: false },
            { key: "12", nickname: "", connected: false },
            { key: "17", nickname: "", connected: false },
            { key: "20", nickname: "", connected: false },
          ],
        },
        blue: {
          name: teamBlue,
          players: [
            { key: "7", nickname: "", connected: false },
            { key: "10", nickname: "", connected: false },
            { key: "11", nickname: "", connected: false },
            { key: "18", nickname: "", connected: false },
            { key: "19", nickname: "", connected: false },
          ],
        },
      },
      spectators: ["empty"], // 빈 배열은 안전합니다.
      banSlots: {
        red: ["empty", "empty", "empty", "empty", "empty"], // null 대신 "empty"를 사용
        blue: ["empty", "empty", "empty", "empty", "empty"],
      },
      pickSlots: {
        red: ["empty", "empty", "empty", "empty", "empty"],
        blue: ["empty", "empty", "empty", "empty", "empty"],
      },
      bannedChampions: ["empty", "empty", "empty", "empty", "empty"], // 빈 배열은 허용됩니다.
      pickedChampions: ["empty", "empty", "empty", "empty", "empty"], // 빈 배열은 허용됩니다.
    };

    await newSessionRef.set(initialSessionData); // 데이터를 한 번에 저장

    console.log("Data successfully saved:", sessionId);

    return NextResponse.json({ sessionId }, { status: 201 });
  } catch (error) {
    console.error("Error creating session:", error);
    return NextResponse.json({ error: "오류 발생" }, { status: 500 });
  }
}
