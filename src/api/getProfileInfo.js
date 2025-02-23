export async function getProfileInfo(token) {
  return await fetch('http://localhost:3000/api/alunos/perfil', {
    headers: { Authorization: `Bearer ${token}` },
  });
}
