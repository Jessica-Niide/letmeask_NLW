import { FormEvent, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { lightColorScheme, darkColorScheme, useTheme } from '../hooks/useTheme';
import { database } from '../services/firebase';
import { Button } from '../components/Button';
import { ToggleButton } from '../components/Toggle';
import darkThemeLogoImg from '../assets/images/dark-theme-logo.svg';
import logoImg from '../assets/images/logo.svg';
import smallHomeImg from '../assets/images/small-home.png';
import illustrationImg from '../assets/images/illustration.svg';
import googleIconImg from '../assets/images/google-icon.svg';
import '../styles/home.scss';

export function Home() {
    const history = useHistory();
    const { user, signInWithGoogle } = useAuth();
    const { themeName, changeTheme } = useTheme();
    const [ roomCode, setRoomCode ] = useState('');
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
            <header className="toggles">
            <ToggleButton
            name="toggle-theme"
            checked={themeName === 'dark' ? true : false}
            onChange={event => (event.target.checked) ? setColorTheme('dark') : setColorTheme('light')}
            value={colorTheme}/>
            </header>
            <div className="mobile-home">
                <img src={smallHomeImg} alt="Ilustração simbolizando perguntas e respostas" className="home-illustration" />
                <div className="home-info">
                    <img src={darkThemeLogoImg} alt="Logo Letmeask" className="dark-logo"/>
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
                    <img src={colorTheme === 'dark' ? darkThemeLogoImg : logoImg} alt="Logo Letmeask" className="logo" />
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