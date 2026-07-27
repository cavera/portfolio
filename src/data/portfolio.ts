import { AuthoredExperience, AuthoredProject, Photo, SocialLink } from '@/types/project'

const CIMG = 'https://res.cloudinary.com/dwrxp5sqk/image/upload'

export const email = 'cavera.de@gmail.com'
export const photoProfile = 'https://500px.com/p/LeonardoFonseca'
export const aboutPortrait = 'https://res.cloudinary.com/dwrxp5sqk/image/upload/v1691806331/cavera/profile_about.jpg'

export const socials: SocialLink[] = [
	{ name: 'GitHub', url: 'https://github.com/cavera' },
	{ name: 'Behance', url: 'https://behance.net/cavera' },
	{ name: 'LinkedIn', url: 'https://linkedin.com/in/leonardo-ui/' },
	{ name: '500px', url: 'https://500px.com/p/LeonardoFonseca' },
]

export const stats = [
	{ n: '15+', key: 'years', acc: true },
	{ n: '40+', key: 'projects' },
	{ n: 'EN/ES', key: 'langs' },
]

export const skills = [
	'Solutions architecture',
	'React',
	'Next.js',
	'GSAP',
	'TypeScript',
	'SASS',
	'HTML / CSS',
	'Figma',
	'UI & interaction design',
	'Typographic design',
	'Articulate Storyline',
	'Notion CMS',
]

export const certs = ['LXD LATAM Summit 2023', 'Software Engineering Fundamentals', 'REST APIs with JavaScript']

export const experience: AuthoredExperience[] = [
	{
		when: 'Aug 2024 — Present',
		role: 'Solutions Architect',
		co: 'RebelMouse · Remote',
		en: 'Lead the technical side of service delivery: planning solutions, scoping and costing work, and bridging client requests with engineering.',
		es: 'Lidero el lado técnico de la entrega: planeo soluciones, dimensiono y estimo el trabajo, y conecto las solicitudes de clientes con ingeniería.',
		badge: 'Current',
	},
	{
		when: 'Nov 2023 — Aug 2024',
		role: 'Platform Engineer',
		co: 'RebelMouse · Remote',
		en: 'Shipped custom platform features for publishers — donation workflows for Lakeville Journal & Millerton News, and translation-workflow improvements.',
		es: 'Entregué funcionalidades a medida para editores — flujos de donación para Lakeville Journal y Millerton News, y mejoras en el flujo de traducción.',
	},
	{
		when: '2012 — 2023',
		role: 'Head of Design / Tech Advisor / Front-end',
		co: 'CrearMedia · Lima',
		en: 'Led the design vision for e-learning across Latin America and a remote team of designers; drove the Flash→HTML5 & responsive transition; built onboarding & certification UIs used by thousands.',
		es: 'Lideré la visión de diseño de e-learning en Latinoamérica y un equipo remoto de diseñadores; impulsé la transición de Flash a HTML5 y responsive; construí interfaces de onboarding y certificación usadas por miles.',
	},
	{
		when: '2008 — 2012',
		role: 'Creative / Graphic Designer',
		co: 'CrearMedia · Bogotá',
		en: 'UI and interaction design for e-learning projects — where the craft started.',
		es: 'Diseño UI y de interacción para proyectos de e-learning — donde empezó el oficio.',
	},
]

export const projects: AuthoredProject[] = [
	{
		id: 'reserva-tu-campo',
		title: 'Reserva tu campo',
		img: `${CIMG}/v1699389800/portfolio/reserva_tu_campo.webp`,
		kind: { en: 'Case study · Product & front-end', es: 'Caso de estudio · Producto & front-end' },
		desc: {
			en: 'A booking platform for football pitches — led UI design and front-end with a cross-country team, from idea to live product.',
			es: 'Una plataforma para reservar canchas de fútbol — lideré el diseño UI y el front-end con un equipo multinacional, de la idea al producto en vivo.',
		},
		tags: ['UI design', 'React', 'Tailwind', 'Figma', 'TypeScript'],
		year: '2024',
		live: 'https://reservatucampo.vercel.app/',
		code: 'https://github.com/No-Country/c14-39-ft-typescript-react',
		hasCase: true,
		role: { en: 'UI design + front-end lead', es: 'Líder de diseño UI + front-end' },
		stack: ['Figma', 'React', 'TypeScript', 'Tailwind'],
		case: {
			context: {
				en: 'A team project (No Country tech bootcamp) to build a platform where players find and reserve a football pitch in a few taps — and where pitch owners manage availability.',
				es: 'Un proyecto en equipo (bootcamp No Country) para construir una plataforma donde los jugadores encuentran y reservan una cancha en pocos toques — y donde los dueños gestionan la disponibilidad.',
			},
			role: {
				en: 'I led the UI design and front-end. I defined the interface in Figma and built it with the team in React + Tailwind, coordinating a cross-country group of developers and designers from idea to a working live product.',
				es: 'Lideré el diseño UI y el front-end. Definí la interfaz en Figma y la construí con el equipo en React + Tailwind, coordinando un grupo multinacional de desarrolladores y diseñadores, de la idea a un producto funcional en vivo.',
			},
			process: [
				{
					en: 'Discovery — mapped the booking flow and the two sides of the marketplace: players reserving, owners listing.',
					es: 'Descubrimiento — mapeé el flujo de reserva y los dos lados del marketplace: jugadores reservando, dueños publicando.',
				},
				{
					en: 'UI system — a clean, mobile-first design system in Figma: type scale, components, and the reservation flow.',
					es: 'Sistema UI — un sistema de diseño limpio, mobile-first en Figma: escala tipográfica, componentes y el flujo de reserva.',
				},
				{
					en: 'Build — translated the design into React + Tailwind components and wired the end-to-end reservation flow with the team.',
					es: 'Construcción — traduje el diseño a componentes React + Tailwind y conecté el flujo de reserva de extremo a extremo con el equipo.',
				},
			],
			outcome: {
				en: 'Shipped a working, live product within the bootcamp timeline, coordinating a remote multidisciplinary team. [Add your metrics here — team size, fields listed, bookings.]',
				es: 'Entregamos un producto funcional y en vivo dentro del cronograma del bootcamp, coordinando un equipo remoto multidisciplinario. [Agrega tus métricas aquí — tamaño del equipo, canchas listadas, reservas.]',
			},
		},
	},
	{
		id: 'shopi-store',
		title: 'Shopi Store',
		img: `${CIMG}/v1692241922/portfolio/shopistore.png`,
		kind: { en: 'E-commerce · Front-end', es: 'E-commerce · Front-end' },
		desc: { en: 'A complete storefront with cart, filtering and product flows.', es: 'Una tienda completa con carrito, filtros y flujos de producto.' },
		tags: ['React', 'Tailwind', 'CSS'],
		year: '2023',
		live: 'https://shopi-store.netlify.app/',
		code: 'https://github.com/cavera/react-store',
		hasCase: true,
		role: { en: 'Design + front-end', es: 'Diseño + front-end' },
		stack: ['React', 'Tailwind', 'CSS'],
		case: {
			context: {
				en: 'A self-initiated project to push my front-end skills — specifically REST API consumption, state management, and cart logic in React. No client brief, just a clear personal goal: build something complete, from scratch.',
				es: 'Un proyecto propio para profundizar mis habilidades front-end — específicamente el consumo de APIs REST, la gestión de estado y la lógica del carrito en React. Sin brief de cliente, solo un objetivo claro: construir algo completo, desde cero.',
			},
			role: {
				en: 'I handled everything — design, architecture, and build. The focus was on wiring different endpoint types (listing, filtering, single product, cart operations) and persisting cart state across sessions.',
				es: 'Me encargué de todo — diseño, arquitectura y desarrollo. El foco estuvo en conectar distintos tipos de endpoints (listado, filtros, producto individual, operaciones del carrito) y persistir el estado del carrito entre sesiones.',
			},
			process: [
				{
					en: 'Mapped all the endpoint types I needed to practice: product listing, filtering by category, single product detail, and cart operations — then designed the UI around that data structure.',
					es: 'Mapeé todos los tipos de endpoints que necesitaba practicar: listado de productos, filtros por categoría, detalle individual y operaciones del carrito — luego diseñé la UI en torno a esa estructura de datos.',
				},
				{
					en: 'Built a persistent cart using localStorage: items survive page reloads and the state stays in sync with the UI across navigations.',
					es: 'Construí un carrito persistente con localStorage: los ítems sobreviven las recargas y el estado se mantiene sincronizado con la UI a través de las navegaciones.',
				},
				{
					en: 'Debugged on the go — race conditions, stale state, edge cases in cart logic. No tutorials; just reading docs, isolating the bug, and fixing it.',
					es: 'Depuré sobre la marcha — condiciones de carrera, estado obsoleto, casos borde en la lógica del carrito. Sin tutoriales; solo leyendo docs, aislando el bug y resolviéndolo.',
				},
			],
			outcome: {
				en: 'My first complete app persisting state through a real API. The main gain was the fluency I built around async data flows, error handling, and the discipline of finishing a personal project end-to-end.',
				es: 'Mi primera app completa que persiste estado a través de una API real. El mayor aprendizaje fue la fluidez que desarrollé con flujos de datos asíncronos, manejo de errores y la disciplina de terminar un proyecto propio de principio a fin.',
			},
		},
	},
	{
		id: 'mymovies',
		title: 'myMovies',
		img: `${CIMG}/v1692240684/portfolio/mymovies_bg.png`,
		kind: { en: 'App · Front-end', es: 'App · Front-end' },
		desc: { en: 'A movie discovery app with a rich, media-forward UI.', es: 'Una app para descubrir películas con una UI rica y centrada en el contenido.' },
		tags: ['React', 'SASS', 'JS'],
		year: '2023',
		live: 'https://cav-movie.netlify.app/',
		code: 'https://github.com/cavera/myMovies',
		hasCase: true,
		role: { en: 'Design + front-end', es: 'Diseño + front-end' },
		stack: ['React', 'SASS', 'TMDB API'],
		case: {
			context: {
				en: "A personal project with one deliberate constraint: no AI tools. My professional work lives under NDA and can't be shown publicly — so myMovies is a direct, unassisted demonstration of what I design and build on my own.",
				es: 'Un proyecto personal con una restricción deliberada: sin herramientas de IA. Mi trabajo profesional está bajo NDA y no puedo mostrarlo públicamente — así que myMovies es una demostración directa y sin asistencia de lo que diseño y construyo por mi cuenta.',
			},
			role: {
				en: 'Designer, UI designer, and front-end developer — all three. I defined the visual language, built the component system in SASS, and wired the TMDB API for discovery, search, and detail views.',
				es: 'Diseñador, diseñador UI y desarrollador front-end — los tres. Definí el lenguaje visual, construí el sistema de componentes en SASS y conecté la API de TMDB para descubrir, buscar y ver el detalle de películas.',
			},
			process: [
				{
					en: 'Defined a media-forward visual language: dark background, high-contrast type, poster-led layouts — designed to put the content first and practice building a full design system from scratch.',
					es: 'Definí un lenguaje visual centrado en el contenido: fondo oscuro, tipografía de alto contraste, layouts liderados por el póster — diseñado para poner el contenido primero y practicar construir un sistema de diseño desde cero.',
				},
				{
					en: 'Built a personal favorites list persisted in localStorage — no backend, no auth, just a clean mental model of the browser as memory.',
					es: 'Construí una lista de favoritos personales persistida en localStorage — sin backend, sin auth, solo un modelo mental claro del navegador como memoria.',
				},
				{
					en: 'Hand-wrote every interaction and animation — no component libraries, no AI completions. The constraint forced a deeper understanding of CSS and JS fundamentals.',
					es: 'Escribí a mano cada interacción y animación — sin librerías de componentes, sin autocompletado de IA. La restricción forzó una comprensión más profunda de CSS y JS.',
				},
			],
			outcome: {
				en: 'A polished, fully working app that shows UI design and front-end craft without scaffolding. Proof I can ship a visually intentional product — from blank canvas to deployed app — entirely on my own.',
				es: 'Una app pulida y completamente funcional que muestra diseño UI y oficio front-end sin andamiaje. Prueba de que puedo entregar un producto visualmente intencional — desde el lienzo en blanco hasta la app desplegada — completamente por mi cuenta.',
			},
		},
	},
	{
		id: 'complete-the-sentence',
		title: 'Complete the sentence',
		img: `${CIMG}/v1692239932/portfolio/complete_sentencebg.png`,
		kind: { en: 'E-learning · Interaction', es: 'E-learning · Interacción' },
		desc: { en: 'A drag-and-drop learning interaction, animated with GSAP.', es: 'Una interacción de aprendizaje de arrastrar y soltar, animada con GSAP.' },
		tags: ['GSAP', 'JS', 'CSS'],
		year: '2022',
		live: 'https://cavera.github.io/drag-and-drop-interaction/',
		code: 'https://github.com/cavera/drag-and-drop-interaction',
		hasCase: true,
		role: { en: 'Interaction design + build', es: 'Diseño de interacción + desarrollo' },
		stack: ['GSAP', 'Vanilla JS', 'CSS'],
		case: {
			context: {
				en: 'Fill-in-the-blank drag-and-drop is a staple of e-learning design. I wanted to build one entirely myself — from interaction logic to animation — as a benchmark of my craft, independent of the authoring tools I used at work.',
				es: 'Completar la oración arrastrando palabras es un recurso habitual en el diseño de e-learning. Quería construir una completamente por mi cuenta — desde la lógica de interacción hasta la animación — como referente de mi oficio, independiente de las herramientas de autor que usaba en el trabajo.',
			},
			role: {
				en: 'Interaction designer and sole developer. I designed the UX states, wrote all the JS drag-and-drop logic from scratch, and handled the animation layer with GSAP.',
				es: 'Diseñador de interacción y único desarrollador. Diseñé los estados UX, escribí toda la lógica de arrastrar y soltar desde cero en JS, y manejé la capa de animación con GSAP.',
			},
			process: [
				{
					en: 'Mapped every interaction state: idle, dragging, correct drop, incorrect drop, and completion — then designed distinct visual and animated feedback for each.',
					es: 'Mapeé cada estado de la interacción: inactivo, arrastrando, soltar correcto, soltar incorrecto y completado — luego diseñé feedback visual y animado distinto para cada uno.',
				},
				{
					en: 'Built the drag-and-drop logic in vanilla JS, deliberately migrating away from a jQuery-based reference to learn and apply the modern equivalents — pointer events, element positioning, hit detection.',
					es: 'Construí la lógica de arrastrar y soltar en JavaScript puro, migrando deliberadamente desde una referencia en jQuery para aprender y aplicar los equivalentes modernos — pointer events, posicionamiento de elementos, detección de colisión.',
				},
				{
					en: 'Layered GSAP animations on top of the logic — drops, resets, the completion sequence — to make the interaction feel smooth rather than mechanical.',
					es: 'Agregué animaciones GSAP sobre la lógica — soltar, reiniciar, la secuencia de completado — para que la interacción se sintiera fluida y no mecánica.',
				},
			],
			outcome: {
				en: 'A clean, reusable e-learning interaction built without authoring tools. The key learning: the discipline of migrating a legacy jQuery implementation to modern vanilla JS — understanding what every line actually does, rather than inheriting patterns blindly.',
				es: 'Una interacción de e-learning limpia y reutilizable, construida sin herramientas de autor. El aprendizaje clave: la disciplina de migrar una implementación legacy de jQuery a JS moderno — entendiendo qué hace cada línea, en vez de heredar patrones a ciegas.',
			},
		},
	},
]

export const photos: Photo[] = [
	{
		id: 'ph_amsterdam',
		aspect: '3/2',
		title: 'Amsterdam postcard',
		link: 'https://500px.com/photo/1117490159/amsterdam-postcard-by-leonardo-fonseca',
		src: 'https://drscdn.500px.org/photo/1117490159/q%3D75_m%3D600_k%3D1/v2?sig=e375f3780454f69548deff2ffb6df50ab3cfd8c07e5be84ed90a74076b7c9e2c',
	},
	{
		id: 'ph_waiting',
		aspect: '3/2',
		title: 'Waiting my road',
		link: 'https://500px.com/photo/1114209502/waiting-my-rode-by-leonardo-fonseca',
		src: 'https://drscdn.500px.org/photo/1114209502/q%3D75_m%3D600_k%3D1/v2?sig=21f56f45c8eb1ece9ed807eb684a31f4966729127a0f66ed075d5049ca6c375a',
	},
	{
		id: 'ph_greenish',
		aspect: '3/2',
		title: 'Greenish City',
		link: 'https://500px.com/photo/1112700543/greenish-city-by-leonardo-fonseca',
		src: 'https://drscdn.500px.org/photo/1112700543/q%3D75_m%3D600_k%3D1/v2?sig=1b26dd2053ad05901ab9a6b31e70bac8467525fca2e8577ab581aa30fa76bb3b',
	},
	{
		id: 'ph_bloom',
		aspect: '2/3',
		title: 'Before bloom',
		link: 'https://500px.com/photo/1106230750/before-bloom-by-leonardo-fonseca',
		src: 'https://drscdn.500px.org/photo/1106230750/q%3D75_m%3D600_k%3D1/v2?sig=f636205164848fe9cb2fdae4f9a7dbd9bb3ec87dac47b777f4951e238209c03d',
	},
]
