import { useEffect, useState } from "react";
import { database } from "../services/firebase";
import { useAuth } from "./useAuth";

type QuestionType = {
	id: string;
	author: {
		name: string;
		avatar: string;
	};
	content: string;
	isHighlighted: boolean;
	isAnswered: boolean;
	likeCount: number;
	likeId: string | undefined;
}

type FirebaseQuestions = Record<string, {
	author: {
		name: string;
		avatar: string;
	};
	content: string;
	isHighlighted: boolean;
	isAnswered: boolean;
	likes: Record<string, { authorId: string }>;
}>

export function useRoom(roomId: string) {
    const { user } = useAuth();
    const [ title, setTitle]  = useState('');
    const [ author, setAuthor ] = useState('');
    const [ roomPermission, setRoomPermission ] = useState(false);
    const [ questions, setQuestions ] = useState<QuestionType[]>([]);

    useEffect(() => {
        const roomRef = database.ref(`rooms/${roomId}`);

        roomRef.on('value', room => {
            const databaseRoom = room.val();
            const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};
            const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
                return {
                    id: key,
                    content: value.content,
                    author: value.author,
                    isHighlighted: value.isHighlighted,
					isAnswered: value.isAnswered,
					likeCount: Object.values(value.likes ?? {}).length,
					likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0],
				}
			});
			const orderedQuestions = parsedQuestions.sort((a) => 
			!a.isHighlighted ? 1 : -1);
			const reOrderedQuestions = orderedQuestions.sort((a, b) => 
			b.isAnswered ? -1 : 1);
			const finalQuestions = reOrderedQuestions.sort((a, b) => 
			!b.isHighlighted ? b.likeCount - a.likeCount : 1)

			setTitle(databaseRoom.title);
			setAuthor(databaseRoom.authorId);
			setRoomPermission(databaseRoom.roomPerm);
			setQuestions(finalQuestions);
		})

		return () => {
			roomRef.off('value');
		}
	}, [roomId, user?.id]);
	return { questions, title, author, roomPermission }
}