import connectToDatabase from '@/lib/mongoose'
import { getSession } from 'next-auth/react';
import { NextApiRequest, NextApiResponse } from "next";
import QRCode from '@/models/QRCode';


export async function POST(req: NextApiRequest, res: NextApiResponse) {
	await connectToDatabase();

	const session = await getSession({ req });

	if (!session) {
		return res.status(401).json({ message: 'Unauthorized' });
	}

	const body = JSON.parse(req.body);

	QRCode.create()
}