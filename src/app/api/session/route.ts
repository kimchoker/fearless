import { NextRequest, NextResponse } from "next/server";
import admin from "firebase-admin";

// Firebase Admin 초기화
if (!admin.apps.length) {
	const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_CREDENTIALS!);

	admin.initializeApp({
		credential: admin.credential.cert(serviceAccount),
		databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL!,
	});
	
}

const database = admin.database();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { teamRed, teamBlue } = body;

    if (!teamRed || !teamBlue) {
      return NextResponse.json({ error: "Invalid input data" }, { status: 400 });
    }

    const sessionsRef = database.ref("sessions");
    const newSessionRef = sessionsRef.push();
    const sessionId = newSessionRef.key;

    if (!sessionId) throw new Error("Session ID creation failed");

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
      spectators: [],
      banSlots: { red: [null, null, null, null, null], blue: [null, null, null, null, null] },
      pickSlots: { red: [null, null, null, null, null], blue: [null, null, null, null, null] },
      bannedChampions: [],
      pickedChampions: [],
    };

    await newSessionRef.update(initialSessionData);

    return NextResponse.json({ sessionId }, { status: 201 });
  } catch (error) {
    console.error("Error creating session:", error);
    return NextResponse.json({ error: "오류 발생" }, { status: 500 });
  }
}
