import { useHistory } from 'react-router-dom';

import darkLogoImg from '../assets/images/dark-theme-logo.svg';
import logoImg from '../assets/images/logo.svg';
import smallHomeImg from '../assets/images/small-home.png';
import illustrationImg from '../assets/images/illustration.svg';
import googleIconImg from '../assets/images/google-icon.svg';

import '../styles/home.scss';
import { Button } from '../components/Button';
import { useAuth } from '../hooks/useAuth';
import { FormEvent } from 'react';
import { useState } from 'react';
import { database } from '../services/firebase';

export function Home() {
    const history = useHistory();
    const { user, signInWithGoogle } = useAuth();
    const [roomCode, setRoomCode] = useState('');

    async function handleCreateRoom() {
        if (!user) {
            await signInWithGoogle();
        }
        history.push('/rooms/new');
    }

    async function handleJoinRoom(event: FormEvent) {
        event.preventDefault();
        if (roomCode.trim() === '') {
            return ;
        }
        const roomRef = await database.ref(`rooms/${roomCode}`).get();
        if (!(roomRef.exists())) {
            alert('Essa sala não existe');
            return ;
        }
        if (roomRef.val().closedAt) {
            alert('Sala encerrada');
            return ;
        }
        history.push(`/rooms/${roomCode}`);
    }

    return (
        <div id="page-auth">
            <div className="mobile-home">
                <img src={smallHomeImg} alt="Ilustração simbolizando perguntas e respostas" className="home-illustration" />
                <div className="home-info">
                    <img src={darkLogoImg} alt="Logo Letmeask" className="dark-logo"/>
                    <strong>Crie salas de Q&amp;A</strong>
                    <p>Todas as perguntas em um só lugar, em tempo real</p>
                </div>
            </div>
            <aside>
                <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
                <strong>Crie salas de Q&amp;A</strong>
                <p>Todas as perguntas em um só lugar, em tempo real</p>
            </aside>
            <main className="main-home">
                <div className="main-content" >
                    <img src={logoImg} alt="Logo Letmeask" className="logo" />
                <button className="create-room" onClick={handleCreateRoom}>
                    <img src={googleIconImg} alt="Logo do Google" />
                    Crie sua sala com o Google </button>
                <div className="separator" >
                    ou entre em uma sala
                    </div>
                <form onSubmit={handleJoinRoom}>
                    <input
                    type="text"
                    placeholder="Digite o código da sala" 
                    onChange={event => setRoomCode(event.target.value)}
                    value={roomCode}
                    />
                    <Button type="submit">
                        Entrar na sala
                    </Button>
                </form>
                </div>

            </main>
        </div>

    )
}