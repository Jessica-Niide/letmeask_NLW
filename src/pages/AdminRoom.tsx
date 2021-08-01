import { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom'
import { useRoom } from '../hooks/useRoom';
import { useAuth } from '../hooks/useAuth';
import { lightColorScheme, darkColorScheme, useTheme } from '../hooks/useTheme';
import { database } from '../services/firebase';
import { Question } from '../components/Question';
import { RoomCode } from '../components/RoomCode';
import { Button } from '../components/Button';
import { ToggleButton } from '../components/Toggle';
import darkThemeLogoImg from '../assets/images/dark-theme-logo.svg';
import logoImg from '../assets/images/logo.svg';
import emptyQuestionsImg from '../assets/images/empty-questions.svg'
import checkImg from '../assets/images/check.svg';
import uncheckImg from '../assets/images/uncheck.svg';
import answerImg from '../assets/images/answer.svg';
import deleteImg from '../assets/images/delete.svg';
import '../styles/room.scss';

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
	const { themeName, changeTheme } = useTheme();
	const [ colorTheme, setColorTheme ] = useState(themeName);

    if (!colorTheme) {
        const initial = localStorage.getItem("theme");
        if (initial === 'light') {
            setColorTheme('light')
        }
        else {
            setColorTheme('dark')
        }
    }

    useEffect(() => {
        localStorage.setItem("theme", colorTheme);
        changeTheme(colorTheme === 'dark' ? darkColorScheme : lightColorScheme);
	}, [ colorTheme, changeTheme ]);

	useEffect(() => {
		if(author){
			if(user?.id !== author){
				alert('Você não tem permissão para entrar nessa página');
				history.push(`/rooms/${roomId}`);
			}
		}
	},[history, author, user, roomId]);

	if(!user && !author){
		return <p>Carregando</p>
	}

	async function handleEndRoom() {
		if (window.confirm('Tem certeza que você deseja encerrar a sala?')) {
			await database.ref(`rooms/${roomId}`).update({
				endedAt: new Date(),
			})
			history.push('/');
		}
	}

	async function handleDeleteQuestion(questionId: string) {
		if (window.confirm('Tem certeza que você deseja excluir esta pergunta?')) {
			await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
		}
	}

	async function handleCheckQuestionAsAnswered(questionId: string, answeredQuestion: boolean) {
		if (!answeredQuestion) {
			await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
				isAnswered: true,
			});
		}
		else {
			await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
				isAnswered: false,
			});
		}
	}

	async function handleHighlightQuestion(questionId: string) {
		await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
			isHighlighted: true,
		});
	}

	return (
		<div id="page-room">
			<header>
				<div className="content">
				<img src={colorTheme === 'dark' ? darkThemeLogoImg : logoImg} alt="Logo Letmeask" className="logo" />
					<div className="room-options">
						<RoomCode code={roomId} />
						<Button isOutlined onClick={handleEndRoom} >Encerrar sala</Button>
						<ToggleButton 
			            name="toggle-theme"
			            checked={themeName === 'dark' ? true : false}
        			    onChange={event => (event.target.checked) ? setColorTheme('dark') : setColorTheme('light')}
           				value={colorTheme}/>
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
								<>
									<button
										type="button"
										title={question.isAnswered ? "Desmarcar pergunta como respondida" : "Marcar pergunta como respondida"}
										onClick={() => handleCheckQuestionAsAnswered(question.id, question.isAnswered)}
									>
										<img src={question.isAnswered ? uncheckImg : checkImg} alt="Marcar pergunta como respondida" />
									</button>
									<button
										type="button"
										title="Destacar pergunta"
										onClick={() => handleHighlightQuestion(question.id)}
									>
										<img src={answerImg} alt="Destacar pergunta" />
									</button>
									<button
										type="button"
										title="Deletar pergunta"
										onClick={() => handleDeleteQuestion(question.id)}
									>
										<img src={deleteImg} alt="Remover pergunta" />
									</button>
								</>
							</Question>
						);
					})}
				</div>
			</main>
		</div>
	);
}