const SB_URL = 'https://pauyzimjlrjoncbvgkdh.supabase.co';
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhdXl6aW1qbHJqb25jYnZna2RoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0NDI2NDksImV4cCI6MjA5MjAxODY0OX0.XUO9j9AYMcB4n-1DpFh5HGLAdah-rVv94BGE3KE7XBE'; 
const client = supabase.createClient(SB_URL, SB_KEY);

let state = { user: null, view: 'homeSection', isSignUp: false };

window.toggleAuthModal = () => {
    const m = document.getElementById('authModal');
    if(m) m.style.display = (m.style.display === 'flex') ? 'none' : 'flex';
};

window.handleLogout = async () => {
    await client.auth.signOut();
    location.reload();
};

window.showSection = (id) => {
    const sections = ['homeSection', 'myStatsSection', 'sellSection', 'statsSection', 'affiliatesSection', 'academySection', 'vipSection'];
    sections.forEach(s => { const el = document.getElementById(s); if(el) el.style.display = 'none'; });
    const target = document.getElementById(id);
    if(target) target.style.display = 'block';
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
};

async function refreshMarket() {
    const grid = document.getElementById('accountGrid');
    if (!grid) return;
    const { data } = await client.from('accounts').select('*').eq('status', 'available');
    if(data) {
        grid.innerHTML = data.map(acc => `
            <div class="account-card">
                <div class="ia-score">IA ${acc.ia_score}%</div>
                <div class="username">${acc.username}</div>
                <div class="price-row">
                    <span>R$ ${acc.price_brl.toLocaleString()}</span>
                    <button class="btn btn-primary" onclick="alert('Negociação segura iniciada.')">Ver Conta</button>
                </div>
            </div>
        `).join('');
    }
    lucide.createIcons();
}

document.addEventListener('DOMContentLoaded', async () => {
    const { data: { session } } = await client.auth.getSession();
    state.user = session?.user || null;
    
    const landing = document.getElementById('landingPage');
    const shell = document.getElementById('appShell');
    if(state.user) {
        if(landing) landing.style.display = 'none';
        if(shell) shell.style.display = 'flex';
        refreshMarket();
    }

    document.getElementById('authForm').onsubmit = async (e) => {
        e.preventDefault();
        const email = document.getElementById('authEmail').value;
        const password = document.getElementById('authPassword').value;
        const { error } = state.isSignUp ? await client.auth.signUp({email, password}) : await client.auth.signInWithPassword({email, password});
        if(error) alert(error.message); else location.reload();
    };

    document.getElementById('toggleAuth').onclick = () => {
        state.isSignUp = !state.isSignUp;
        document.getElementById('authTitle').innerText = state.isSignUp ? 'Criar Cadastro' : 'Entrar no Nexus';
    };
});
