// Aguarda o carregamento completo do conteúdo da página para executar o script.
document.addEventListener('DOMContentLoaded', function() {

    // --- LÓGICA PARA O MENU HAMBÚRGUER ---
    const menuToggle = document.getElementById('menu-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    // Seleciona todos os links dentro da navegação móvel
    const navLinks = mobileNav.querySelectorAll('.nav-links a');

    // Adiciona um evento de clique ao ícone do menu
    menuToggle.addEventListener('click', () => {
        // Adiciona/remove a classe 'active' para animar o ícone (transforma em 'X')
        menuToggle.classList.toggle('active');
        // Adiciona/remove a classe 'active' para mostrar/esconder o painel de navegação
        mobileNav.classList.toggle('active');
    });

    // Adiciona um evento de clique a cada link do menu mobile
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Remove a classe 'active' para fechar o menu após um clique
            menuToggle.classList.remove('active');
            mobileNav.classList.remove('active');
        });
    });

    // --- LÓGICA PARA ANIMAÇÃO AO ROLAR (SCROLL) ---
    // Seleciona todos os elementos que devem ser animados
    const animatedElements = document.querySelectorAll('.fade-in-up');
    
    // Cria um "observador" que verifica quando os elementos entram na área visível da tela
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Se o elemento estiver visível (intersecting)
            if (entry.isIntersecting) {
                // Adiciona a classe que torna o elemento visível
                entry.target.classList.add('is-visible');
                // Para de observar o elemento para que a animação não se repita
                observer.unobserve(entry.target);
            }
        });
    }, { 
        threshold: 0.1 // A animação começa quando 10% do elemento está na tela
    });
    
    // Pede ao observador para monitorizar cada elemento animado
    animatedElements.forEach(el => { observer.observe(el); });

    // --- LÓGICA PARA O FORMULÁRIO DE CONTATO (FORMSPREE) ---
    const form = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    
    // Verifica se o formulário realmente existe na página
    if(form) {
        form.addEventListener("submit", async function(event) {
            // Impede o comportamento padrão do formulário (que é recarregar a página)
            event.preventDefault();
            
            const data = new FormData(event.target);
            try {
                // Envia os dados do formulário para o endpoint do Formspree
                const response = await fetch(form.action, { 
                    method: form.method, 
                    body: data, 
                    headers: { 'Accept': 'application/json' }
                });
                
                if (response.ok) {
                    // Se o envio foi bem-sucedido
                    formStatus.innerHTML = "Obrigado pelo contato! Sua mensagem foi enviada com sucesso.";
                    formStatus.className = 'success';
                    form.reset(); // Limpa os campos do formulário
                } else {
                    // Se houve um erro no lado do Formspree
                    const responseData = await response.json();
                    if (Object.hasOwn(responseData, 'errors')) {
                       formStatus.innerHTML = responseData["errors"].map(error => error["message"]).join(", ");
                    } else {
                       formStatus.innerHTML = "Oops! Ocorreu um erro ao enviar sua mensagem.";
                    }
                    formStatus.className = 'error';
                }
            } catch (error) {
                // Se houve um erro de rede (ex: sem internet)
                formStatus.innerHTML = "Oops! Ocorreu um erro de rede ao enviar sua mensagem.";
                formStatus.className = 'error';
            } finally {
                // Mostra a mensagem de status (sucesso ou erro)
                formStatus.style.display = 'block';
                // Esconde a mensagem após 6 segundos
                setTimeout(() => { formStatus.style.display = 'none'; }, 6000);
            }
        });
    }

    // --- LÓGICA PARA ATUALIZAR O ANO DO COPYRIGHT ---
    const yearSpan = document.getElementById('copyright-year');
    // Se o elemento existe, define o seu texto para o ano atual
    if(yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});
