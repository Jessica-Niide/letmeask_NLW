import { useParams, useHistory } from 'react-router-dom'
import logoImg from '../assets/images/logo.svg';
import emptyQuestionsImg from '../assets/images/empty-questions.svg'
import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg';
import deleteImg from '../assets/images/delete.svg';
import { Button } from '../components/Button';
import { Question } from '../components/Question';
import { RoomCode } from '../components/RoomCode';
import { useRoom } from '../hooks/useRoom';
import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';
import '../styles/room.scss';
import { useEffect } from 'react';

type RoomParams = {
	id: string;
	authorId: string;
}


export function AdminRoom() {
	const params = useParams<RoomParams>();
	const { user } = useAuth();
	const roomId = params.id;
	const { questions, title, author } = useRoom(roomId);
	const history = useHistory();

	useEffect(() => {
		if(author){
			if(user?.id !== author){
				alert('Você não tem permissão para entrar nessa página');
				history.push(`/rooms/${roomId}`);
			}
		}
	},[history, author, user, roomId]);

	async function handleEndRoom() {
		await database.ref(`rooms/${roomId}`).update({
			endedAt: new Date(),
		})

		history.push('/');
	}

	async function handleDeleteQuestion(questionId: string) {
		if (window.confirm('Tem certeza que você deseja excluir esta pergunta?')) {
			await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
		}
	}

	async function handleCheckQuestionAsAnswered(questionId: string) {
		await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
			isAnswered: true,
		});
	}

	async function handleHighlightQuestion(questionId: string) {
		await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
			isHighlighted: true,
		});
	}

	if(!user && !author){
		return <p>Carregando</p>
	}

	return (
		<div id="page-room">
			<header>
				<div className="content">
					<img src={logoImg} alt="Letmeask" />
					<div>
						<RoomCode code={roomId} />
						<Button isOutlined onClick={handleEndRoom} >Encerrar sala</Button>
					</div>
				</div>
			</header>
			<main>
				<div className="room-title">
					<h1>Sala {title}</h1>
					{questions.length > 1 && <span>{questions.length} perguntas</span>}
					{questions.length === 1 && <span>Uma pergunta</span>}
				</div>
				<div className="empty-room-background" >
				{questions.length === 0 && 
					<>
					<img src={emptyQuestionsImg} alt="Ilustração simbolizando perguntas" />
					<p>Nenhuma pergunta por aqui...</p>
					</>}
				</div>
				<div className="question-list">
					{questions.map(question => {
						return (
							<Question
								key={question.id}
								content={question.content}
								author={question.author}
								isAnswered={question.isAnswered}
								isHighlighted={question.isHighlighted}
							>
								{!question.isAnswered && (
									<>
										<button
											type="button"
											title="Marcar pergunta como respondida"
											onClick={() => handleCheckQuestionAsAnswered(question.id)}
										>
											<img src={checkImg} alt="Marcar pergunta como respondida" />
										</button>
										<button
											type="button"
											title="Destacar pergunta"
											onClick={() => handleHighlightQuestion(question.id)}
										>
											<img src={answerImg} alt="Destacar pergunta" />
										</button>
									</>
								)}
								<button
									type="button"
									title="Deletar pergunta"
									onClick={() => handleDeleteQuestion(question.id)}
								>
									<img src={deleteImg} alt="Remover pergunta" />
								</button>
							</Question>
						);
					})}
				</div>
			</main>
		</div>
	);
}