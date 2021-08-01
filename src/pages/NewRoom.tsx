import { FormEvent, useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { darkColorScheme, lightColorScheme, useTheme } from '../hooks/useTheme'
import { database } from '../services/firebase'
import { Button } from '../components/Button'
import { ToggleButton } from '../components/Toggle'
import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'
import darkThemeLogoImg from '../assets/images/dark-theme-logo.svg'
import smallHomeImg from '../assets/images/small-home.png';
import '../styles/new-room.scss'

export function NewRoom() {
	const history = useHistory();
	const { user } = useAuth();
    const { themeName, changeTheme } = useTheme();
    const [ colorTheme, setColorTheme ] = useState(themeName);
	const [ newRoom, setNewRoom ] = useState('');
	const [ roomPermission, setRoomPermission ] = useState(false);

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
    
	async function handleSetRoomPermission() {
		setRoomPermission(!roomPermission);
		return ;
	}

	async function handleCreateRoom(event: FormEvent) {
		event.preventDefault();
		if (newRoom.trim() === '') {
			return;
		}
		const roomRef = database.ref('rooms');

		const firebaseRoom = await roomRef.push({
			title: newRoom,
			authorId: user?.id,
			roomPerm: roomPermission,
		})
		history.push(`/admin/rooms/${firebaseRoom.key}`)
	}

    return (
        <div id="new-room">
            <header className="toggles">
            <ToggleButton
            name="theme-toggle"
            checked={themeName === 'dark' ? true : false}
            onChange={event => (event.target.checked) ? setColorTheme('dark') : setColorTheme('light')}
            value={colorTheme}/>
            </header>
            <aside>
                <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
                <strong>Crie salas de Q&amp;A</strong>
                <p>Todas as perguntas em um só lugar, em tempo real</p>
            </aside>
            <main className="new-room">
                <div className="main-content" >
                <img src={darkThemeLogoImg} alt="Logo Letmeask" className="new-room-mobile-logo"/>
                <img src={smallHomeImg} alt="Ilustração simbolizando perguntas e respostas" className="new-room-mobile-img"/>

                <img src={colorTheme === 'dark' ? darkThemeLogoImg : logoImg} alt="Logo Letmeask" className="logo" />
                    <h2>Crie uma nova sala</h2>
                <form onSubmit={handleCreateRoom} >
                    <input
                    type="text"
                    placeholder="Nome da sala"
                    onChange={event => setNewRoom(event.target.value)}
                    value={newRoom}
                    />
                    <Button type="submit">
                        Criar sala
                    </Button>
                    <div className="anonymous-permission" >
                        <span>Permitir perguntas anônimas?</span>
                        <input 
                            type="checkbox" 
                            className="checkbox"
                            onChange={handleSetRoomPermission} />
                    </div>
                </form>
                <p>Quer entrar em uma sala existente? <Link to="/">Clique aqui</Link></p>
                </div>

            </main>
        </div>

    )
}