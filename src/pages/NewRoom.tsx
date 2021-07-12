import { FormEvent, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'
import { useAuth } from '../hooks/useAuth'
import { database } from '../services/firebase'
import { Button } from '../components/Button'
import '../styles/auth.scss'
import { ToggleButton } from '../components/Toggle'

export function NewRoom() {
	const { user } = useAuth();
	const history = useHistory();
	const [newRoom, setNewRoom] = useState('');
	const [roomPermission, setRoomPermission] = useState(false);

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
        <div id="page-auth">
            <aside>
                <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
                <strong>Crie salas de Q&amp;A</strong>
                <p>Todas as perguntas em um só lugar, em tempo real</p>
            </aside>
            <main className="new-room">
                <div className="main-content" >
                    <img src={logoImg} alt="Logo Letmeask" className="new-room-logo" />
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
                    <div className="toggle-type" >
                        <span>Permitir perguntas anônimas?</span>
                        <ToggleButton onClick={handleSetRoomPermission}/>
                    </div>
                </form>
                <p>Quer entrar em uma sala existente? <Link to="/">Clique aqui</Link></p>
                </div>

            </main>
        </div>

    )
}