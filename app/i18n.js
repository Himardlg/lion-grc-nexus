// Nexus GRC Lion — traducciones ES/EN (traduce el DOM al cambiar de idioma)
(function () {
  'use strict';

  const T = {
    // ---------- Organizaciones ----------
    'Mis empresas': 'My organizations',
    'Mis organizaciones': 'My organizations',
    'Empresas': 'Companies',
    'Empresa': 'Company',
    'Nueva empresa': 'New organization',
    '+ Nueva empresa': '+ New organization',
    'Nueva organización': 'New organization',
    'Crear primera organización': 'Create your first organization',
    'Crear organización': 'Create organization',
    'Crear una organización': 'Create an organization',
    'Crear o elegir empresa': 'Create or choose organization',
    'Añadir empresa': 'Add organization',
    'Editar datos': 'Edit details',
    'Editar organización': 'Edit organization',
    'Editar': 'Edit',
    'Eliminar empresa': 'Delete organization',
    'Eliminar organización': 'Delete organization',
    'Eliminar': 'Delete',
    'Eliminar seleccionadas': 'Delete selected',
    'Seleccionar todas': 'Select all',
    'Seleccionar empresa': 'Select organization',
    'seleccionadas': 'selected',
    'Cancelar': 'Cancel',
    'Guardar': 'Save',
    'Guardar cambios': 'Save changes',
    'Abrir empresa': 'Open organization',
    'Abrir organización': 'Open organization',
    'Ver y gestionar organizaciones': 'View and manage organizations',
    'Crear un nuevo proyecto': 'Create a new project',
    'Configurar empresa': 'Configure organization',
    'Contexto y alcance': 'Context and scope',
    'Aplicación, motor y catálogos': 'App, engine and catalogs',
    'Configuración Nexus': 'Nexus settings',
    'Configuración de Nexus': 'Nexus settings',
    'ORGANIZACIÓN ACTIVA': 'ACTIVE ORGANIZATION',
    'EMPRESA ACTIVA': 'ACTIVE ORGANIZATION',
    'ORGANIZACIÓN': 'ORGANIZATION',
    'ESPACIO DE TRABAJO': 'WORKSPACE',
    'BIENVENIDO': 'WELCOME',
    'Inicio': 'Home',
    'Nombre': 'Name',
    'Organización': 'Organization',
    'Sector': 'Industry',
    'Tamaño': 'Size',
    'Empleados': 'Employees',
    'Criticidad': 'Criticality',
    'Categoría ENS': 'ENS category',
    'Nivel ENS por dimensión (opcional)': 'ENS level per dimension (optional)',
    'Clasificación NIS2': 'NIS2 classification',
    'DORA: marco simplificado (art. 16)': 'DORA: simplified framework (art. 16)',
    'Entidad financiera': 'Financial entity',
    'Entidad pública': 'Public entity',
    'Utiliza/desarrolla IA': 'Uses/develops AI',
    'Trata información sensible': 'Handles sensitive information',
    'Sin determinar': 'Not specified',
    'Sin empresa': 'No organization',
    'Sector no definido': 'Industry not specified',
    'Sin tamaño': 'Size not specified',
    'Pequeña': 'Small',
    'Mediana': 'Medium',
    'Grande': 'Large',
    'Baja': 'Low',
    'Media': 'Medium',
    'Alta': 'High',
    'Básica': 'Basic',
    'Activa': 'Active',
    'Según categoría': 'By category',
    'organizaciones guardadas': 'organizations saved',
    'normas': 'frameworks',
    'norma': 'framework',
    'normas seleccionadas': 'selected frameworks',
    'evaluaciones': 'assessments',
    'acciones': 'actions',
    'Aún no hay ninguna empresa': 'There are no organizations yet',
    'Aún no tienes organizaciones': 'You do not have any organizations yet',
    'Empieza por crear tu organización': 'Start by creating your organization',
    'Crea una organización o importa una exportada para empezar a mapear sus normas.':
      'Create an organization or import an exported one to start mapping its frameworks.',
    'Importar': 'Import',
    'Importar organización': 'Import organization',
    'Importar empresa': 'Import organization',
    'Cargar empresa de ejemplo': 'Load demo organization',
    'Cada organización tiene su propio proyecto, evaluación, normativa, evidencias, riesgos y acciones.':
      'Each organization has its own project, assessments, frameworks, evidence, risks, and actions.',
    'Cada organización mantiene sus propias evaluaciones, normas, evidencias y acciones.':
      'Each organization has its own assessments, frameworks, evidence, and actions.',
    'Gestiona tus organizaciones, abre un proyecto o modifica sus datos.':
      'Manage your organizations, open a project, or edit its details.',
    'Crea una organización para empezar a trabajar con tus evaluaciones GRC.':
      'Create an organization to start working with your GRC assessments.',
    'Todo se guarda en este navegador. Puedes eliminar y volver a crear empresas cuando quieras.':
      'Everything is saved in this browser. You can delete and recreate organizations at any time.',
    'Contexto de la empresa': 'Organization details',
    'Guardar contexto y calcular alcance': 'Save details and calculate scope',
    'Los datos se guardan dentro de esta organización y alimentan el motor de aplicabilidad y prioridades.':
      'Data is stored within this organization and feeds the applicability and priority engine.',
    '¿Estás seguro?': 'Are you sure?',
    'Buscar': 'Search',
    'Todos los cambios guardados': 'All changes saved',
    'Cambios guardados': 'Changes saved',
    'Evaluación guardada': 'Assessment saved',
    'No se han podido guardar los cambios': 'Changes could not be saved',

    // ---------- Idioma y apariencia ----------
    'Idioma': 'Language',
    'Español': 'Spanish',
    'Inglés': 'English',
    'Tema': 'Theme',
    'Claro': 'Light',
    'Oscuro': 'Dark',
    'Modo claro': 'Light mode',
    'Modo oscuro': 'Dark mode',
    'Según sistema · próximamente': 'Follow system · coming soon',
    'Según sistema': 'Follow system',
    'Densidad': 'Density',
    'Cómoda': 'Comfortable',
    'Estándar': 'Standard',
    'Compacta': 'Compact',
    'Barra lateral': 'Sidebar',
    'Expandida': 'Expanded',
    'Pantalla inicial': 'Start page',
    'Presentación (Inicio)': 'Introduction (Home)',
    'Pedir confirmación antes de acciones destructivas': 'Ask for confirmation before destructive actions',
    'Ocultar menú': 'Hide menu',
    'Mostrar menú': 'Show menu',
    'Apariencia': 'Appearance',
    'APARIENCIA': 'APPEARANCE',
    'Tema y experiencia': 'Theme and experience',
    'Elige cómo quieres trabajar con Nexus. Los cambios se aplican inmediatamente.':
      'Choose how you want to work with Nexus. Changes apply immediately.',
    'INICIO': 'HOME',
    'Experiencia de entrada': 'Startup experience',
    'Decide qué pantalla quieres ver al abrir o volver a Nexus.':
      'Choose which screen to display when opening or returning to Nexus.',

    // ---------- Navegación ----------
    'Mi perfil': 'My profile',
    'Datos y preferencias': 'Data and preferences',
    'Aplicación y motor GRC': 'App and GRC engine',
    'Estado de sesión': 'Session status',
    'Entorno local': 'Local environment',
    'Panel multinorma': 'Multi-framework panel',
    'Informe imprimible': 'Printable report',
    'Importar SoA Excel': 'Import SoA Excel',
    'Normativa aplicable': 'Applicable frameworks',
    'Biblioteca multinorma': 'Framework library',
    'Equivalencias': 'Equivalences',
    'Comparar normas': 'Compare frameworks',
    'Requisitos': 'Requirements',
    'Controles': 'Controls',
    'Situación actual': 'Current state',
    'Madurez': 'Maturity',
    'Qué necesitas': 'What you need',
    'Plan de acción': 'Action plan',
    'Evidencias': 'Evidence',
    'Riesgos': 'Risks',
    'Auditoría': 'Audit',
    'Mapa multinorma': 'Framework map',
    'Acerca de': 'About',
    'Configuración': 'Settings',
    'Cerrar menú': 'Close menu',
    'Menú': 'Menu',
    'Motor multinorma · GRC · trazabilidad': 'Multi-framework engine · GRC · traceability',

    // ---------- Normativa, requisitos, controles ----------
    '02 · NORMATIVA APLICABLE': '02 · APPLICABLE FRAMEWORKS',
    'Define el alcance': 'Define the scope',
    'Nexus propone marcos a revisar según el contexto. La aplicabilidad jurídica definitiva debe validarse según el caso.':
      'Nexus suggests frameworks to review based on context. Final legal applicability must be validated case by case.',
    'Recomendaciones del motor': 'Engine recommendations',
    'Recomendada por contexto': 'Recommended by context',
    '03 · BIBLIOTECA MULTINORMA': '03 · FRAMEWORK LIBRARY',
    'Catálogo ordenado y trazable': 'Organized, traceable catalog',
    'Fuente oficial': 'Official source',
    'Referencias': 'References',
    'Referencia': 'Reference',
    'Controles relacionados': 'Related controls',
    'Requisitos aplicables': 'Applicable requirements',
    'Universo consolidado de requisitos': 'Consolidated set of requirements',
    'Cubiertos': 'Covered',
    'Cubierto': 'Covered',
    'Parciales': 'Partially covered',
    'Parcial': 'Partial',
    'Gaps': 'Gaps',
    'Gap': 'Gap',
    'gaps': 'gaps',
    'No aplica': 'Not applicable',
    'Todos': 'All',
    'Todos los niveles': 'All levels',
    'Nivel': 'Level',
    'Objetivo': 'Target',
    'objetivo': 'target',
    'Buscar requisito, área o control...': 'Search requirement, area, or control...',
    'Buscar control, área o norma...': 'Search control, area, or framework...',
    'Buscar control...': 'Search controls...',
    'Buscar control, norma o requisito': 'Search control, framework, or requirement',
    'Buscar controles, normas y requisitos': 'Search controls, frameworks and requirements',
    'Buscar en el mapa: control, norma o requisito': 'Search the map: control, framework or requirement',
    'Buscar en el mapa': 'Search the map',
    'Filtrar por norma': 'Filter by framework',
    'Alcance de la biblioteca': 'Library scope',
    'Todas las normas': 'All frameworks',
    'Aplicables ·': 'Applicable ·',
    'Catálogo completo ·': 'Full catalog ·',
    'Catálogo completo': 'Full catalog',
    'Explorando el catálogo completo': 'Exploring the full catalog',
    'Controles aplicables a la empresa': 'Controls applicable to the organization',
    'Sin controles para esta búsqueda': 'No controls match this search',
    'Sin resultados en el mapa': 'No results in the map',
    'Prueba con otra palabra, con el ID de un control o con otra norma.':
      'Try another word, a control ID or a different framework.',
    'Buscar en el catálogo completo': 'Search the full catalog',
    '06 · CONTROLES': '06 · CONTROLS',
    'Biblioteca de capacidades': 'Capability library',
    'Los controles son la unidad de gestión de Nexus: se evalúan una vez y pueden alimentar varios requisitos y normas.':
      'Controls are the management unit in Nexus: they are assessed once and can feed several requirements and frameworks.',
    'Evalúa los controles una sola vez y reutilízalos en los distintos requisitos y normas.':
      'Evaluate controls once and reuse them across requirements and frameworks.',
    'Elegir normativa aplicable': 'Choose applicable frameworks',
    'Seleccionar normativa': 'Select frameworks',
    'Continúa configurando tu empresa': 'Continue setting up your organization',
    'Los controles aparecerán aquí cuando selecciones la normativa aplicable.':
      'Controls will appear here after you select the applicable frameworks.',
    'Ver explicación': 'View explanation',
    'Ver control completo': 'View full control',
    'Ver requisito': 'View requirement',
    'Ver detalle': 'View details',
    'Ver mapa multinorma': 'View framework map',
    'Ver necesidades': 'View needs',
    'Editar evaluación': 'Edit assessment',
    'Guardar evaluación': 'Save assessment',
    'Responsable': 'Owner',
    'Observación / evidencia': 'Notes / evidence',
    'Nivel objetivo de madurez': 'Target maturity level',
    'Medimos para priorizar': 'Measure to prioritize',
    'Madurez media': 'Average maturity',
    'Madurez media:': 'Average maturity:',
    'Niveles del modelo': 'Model levels',
    'Configurar modelo': 'Configure model',
    'madurez': 'maturity',
    'requisitos': 'requirements',
    'requisitos activos': 'active requirements',
    'cobertura estimada': 'estimated coverage',
    'cubiertos': 'covered',
    'multinorma': 'multi-framework',
    '05 · REQUISITOS': '05 · REQUIREMENTS',
    'Seguimiento de requisitos': 'Requirements tracking',
    'Vista consolidada de los requisitos de las normas seleccionadas, con estado derivado de la evaluación de controles.':
      'Consolidated view of the requirements of the selected frameworks, with status derived from control assessments.',
    '07 · SITUACIÓN ACTUAL': '07 · CURRENT STATE',
    '¿Dónde estamos?': 'Where are we?',
    'Evalúa cada capacidad una sola vez. El resultado se reutiliza en todos los requisitos conectados.':
      'Assess each capability once. The result is reused across all connected requirements.',

    // ---------- Mapa y equivalencias ----------
    'MAPA MULTINORMA': 'MULTI-FRAMEWORK MAP',
    '14 · MAPA MULTINORMA': '14 · MULTI-FRAMEWORK MAP',
    'Una evaluación, múltiples requisitos': 'One assessment, multiple requirements',
    'La trazabilidad muestra cómo un control puede cerrar varios requisitos y normas.':
      'Traceability shows how one control can close several requirements and frameworks.',
    'No hay controles que trazar': 'There are no controls to trace',
    'Esta empresa aún no tiene normas seleccionadas. Elige la normativa aplicable para ver cómo cada control cubre requisitos de varias normas.':
      'This organization has no selected frameworks yet. Choose the applicable frameworks to see how each control covers requirements across frameworks.',
    'Esta empresa aún no tiene normas seleccionadas': 'This organization has no selected frameworks yet',
    'Todavía no hay una empresa activa': 'There is no active organization yet',
    'requisitos relacionados': 'related requirements',
    'Consultar fuente oficial': 'Consult official source',
    '04 · EQUIVALENCIAS': '04 · EQUIVALENCES',
    'Matriz de correspondencias revisable': 'Reviewable mapping matrix',
    'correspondencias activas': 'active mappings',
    'pendientes de validar': 'pending validation',
    'validadas por el equipo': 'validated by the team',
    'con observaciones': 'with observations',
    'Buscar norma, referencia, requisito o control...': 'Search framework, reference, requirement, or control...',
    'Todos los estados': 'All statuses',
    'Exportar revisión CSV': 'Export review CSV',
    'Importante:': 'Important:',
    'Estado de revisión': 'Review status',
    'Estado': 'Status',
    'Estado actual': 'Current status',
    'Estado de gestión': 'Management status',
    'Pendiente': 'Pending',
    'Validada': 'Validated',
    'Revisar': 'Review',
    'No equivalente': 'Not equivalent',
    'Revisor': 'Reviewer',
    'Revisado por': 'Reviewed by',
    'Observaciones': 'Comments',
    'Fecha de revisión': 'Review date',
    'Justificación / complemento requerido': 'Rationale / required supplement',
    'Justificación de la revisión': 'Review rationale',
    'Revisar justificación y estado': 'Review rationale and status',
    'Confianza orientativa:': 'Indicative confidence:',
    'Control Nexus:': 'Nexus control:',
    'Control unificado:': 'Unified control:',

    // ---------- Acciones, evidencias, riesgos, auditorías ----------
    '09 · QUÉ NECESITAS': '09 · WHAT YOU NEED',
    'Del gap a la acción': 'From gap to action',
    'capacidades pendientes': 'pending capabilities',
    'Crear acción': 'Create action',
    '10 · PLAN DE ACCIÓN': '10 · ACTION PLAN',
    'Convertimos los gaps en trabajo': 'Turn gaps into action',
    'Generar acciones prioritarias': 'Generate priority actions',
    'Acciones': 'Actions',
    'Fecha límite': 'Due date',
    'Nota': 'Note',
    'Pendiente de definir': 'To be defined',
    'En curso': 'In progress',
    'Bloqueada': 'Blocked',
    'Completada': 'Completed',
    'Verificada': 'Verified',
    'Vencida': 'Overdue',
    '11 · EVIDENCIAS': '11 · EVIDENCE',
    'Demostrar lo que existe': 'Demonstrate what exists',
    'Registra responsable, vigencia y revisión. No adjuntes secretos ni datos personales innecesarios; guarda aquí la referencia segura al repositorio documental.':
      'Record owner, validity and review. Do not attach secrets or unnecessary personal data; store here the secure reference to the document repository.',
    'Nueva evidencia': 'New evidence',
    'Nombre de la evidencia': 'Evidence name',
    'Ruta o enlace seguro': 'Secure path or link',
    'Registrar evidencia': 'Register evidence',
    'Editar evidencia': 'Edit evidence',
    'Guardar evidencia': 'Save evidence',
    'Vigente': 'Current',
    'Obsoleta': 'Obsolete',
    'Notas de revisión': 'Review notes',
    'Sin responsable': 'No owner',
    'Sin fecha': 'No date',
    'Sin referencia': 'No reference',
    'Sin asignar': 'Unassigned',
    'Revisar:': 'Review:',
    'Todavía no hay evidencias registradas.': 'No evidence has been registered yet.',
    '12 · RIESGOS': '12 · RISKS',
    'Conectar cumplimiento y riesgo': 'Connect compliance and risk',
    'Registra valoración inherente, responsable, tratamiento y estado. La puntuación es una ayuda de priorización, no una valoración automática de riesgo residual.':
      'Record inherent assessment, owner, treatment and status. The score is a prioritization aid, not an automatic residual-risk assessment.',
    'Riesgo identificado': 'Identified risk',
    'Responsable del riesgo': 'Risk owner',
    'Impacto': 'Impact',
    'Probabilidad': 'Likelihood',
    'Tratamiento / respuesta': 'Treatment / response',
    'Abierto': 'Open',
    'En tratamiento': 'Being treated',
    'Aceptado': 'Accepted',
    'Cerrado': 'Closed',
    'Registrar riesgo': 'Register risk',
    'Editar riesgo': 'Edit risk',
    'Guardar riesgo': 'Save risk',
    'Responsable:': 'Owner:',
    'Tratamiento:': 'Treatment:',
    'Todavía no hay riesgos registrados.': 'No risks have been registered yet.',
    '13 · AUDITORÍA': '13 · AUDIT',
    'Comprobar y verificar': 'Check and verify',
    'Registra alcance, responsable, fecha y resumen de hallazgos. El seguimiento detallado de cada hallazgo puede vincularse a una acción correctiva.':
      'Record scope, owner, date and a summary of findings. Detailed follow-up of each finding can be linked to a corrective action.',
    'Nombre de auditoría': 'Audit name',
    'Alcance / normas': 'Scope / frameworks',
    'Fecha de auditoría': 'Audit date',
    'Resumen de hallazgos': 'Summary of findings',
    'Planificada': 'Planned',
    'Finalizada': 'Completed',
    'Registrar auditoría': 'Register audit',
    'Editar auditoría': 'Edit audit',
    'Guardar auditoría': 'Save audit',
    'Alcance no indicado': 'Scope not specified',
    'Sin resumen de hallazgos': 'No summary of findings',
    'Todavía no hay auditorías registradas.': 'No audits have been registered yet.',
    'Todavía no hay acciones. Puedes generarlas desde “Qué necesitas”.':
      'There are no actions yet. You can generate them from “What you need”.',
    'No hay controles bajo el nivel objetivo.': 'There are no controls below the target level.',

    // ---------- Detalle de requisito / control ----------
    'Evaluación y aplicabilidad': 'Assessment and applicability',
    'Estos datos se guardan para este requisito y esta empresa, independientemente de la norma.':
      'This data is stored for this requirement and this organization, regardless of the framework.',
    'Aplicabilidad': 'Applicability',
    'Aplica': 'Applies',
    'Automática / pendiente de determinar': 'Automatic / pending determination',
    'Justificación de aplicabilidad': 'Applicability rationale',
    'Evidencia o referencia documental': 'Evidence or document reference',
    'Explica por qué aplica o no aplica': 'Explain why it applies or not',
    'Responsable del requisito': 'Requirement owner',
    'Situación actual, decisiones, excepciones o tareas pendientes': 'Current situation, decisions, exceptions or pending tasks',
    'Ruta, enlace o identificador de evidencia': 'Path, link or evidence identifier',
    'También se guardan automáticamente al salir de cada campo.': 'They are also saved automatically when leaving each field.',
    'Brecha específica de la norma': 'Framework-specific gap',
    'Complemento específico implantado': 'Specific supplement implemented',
    'TRAZABILIDAD': 'TRACEABILITY',
    'Evaluar control': 'Assess control',
    '¿Qué representa?': 'What does it represent?',
    'Explicación': 'Explanation',
    'Normas relacionadas': 'Related frameworks',
    'Evaluar situación actual': 'Assess current state',

    // ---------- Historial ----------
    'HISTORIAL': 'HISTORY',
    'Historial de cobertura': 'Coverage history',
    'Revisiones de cobertura': 'Coverage reviews',
    'Guarda una fotografía del estado actual para compararla con futuras revisiones.':
      'Save a snapshot of the current state to compare with future reviews.',
    'Instantáneas de cobertura y madurez de la empresa activa (se conservan las 12 más recientes).':
      'Coverage and maturity snapshots of the active organization (the 12 most recent are kept).',
    'Guardar revisión': 'Save review',
    '+ Guardar revisión': '+ Save review',
    'revisiones guardadas': 'saved reviews',
    'última cobertura': 'latest coverage',
    'última madurez': 'latest maturity',
    'parciales': 'partially covered',
    'no aplican': 'not applicable',
    'REVISIÓN': 'REVIEW',
    'Revisión de cumplimiento': 'Compliance review',
    'Fecha no disponible': 'Date unavailable',
    'Aún no hay revisiones guardadas.': 'No reviews have been saved yet.',
    'Guardar respaldo completo': 'Download full backup',
    'Descargar respaldo completo': 'Download full backup',
    'Restaurar respaldo completo': 'Restore full backup',
    'La restauración sustituye los datos locales actuales. Se solicita confirmación antes de hacerlo.':
      'Restoring replaces the current local data. Confirmation is requested before proceeding.',

    // ---------- Panel / informe ----------
    'cobertura global': 'overall coverage',
    'capacidades bajo objetivo': 'capabilities below target',
    'Exportar Excel': 'Export Excel',
    'Exportar CSV': 'Export CSV',
    'Imprimir / PDF': 'Print / PDF',
    'Asistente': 'Wizard',
    'Copiar enlace': 'Copy link',
    'Cobertura por norma': 'Coverage by framework',
    'Mayor impacto: ¿qué implantar primero?': 'Highest impact: what to implement first?',
    'Todas las capacidades alcanzan el objetivo.': 'All capabilities reach the target.',
    'Matriz capacidad × norma': 'Capability × framework matrix',
    'Capacidad': 'Capability',
    '(sin seleccionar)': '(not selected)',
    'Si implantas esto una vez… ¿qué cubres?': 'If you implement this once… what do you cover?',

    // ---------- Perfil y sistema ----------
    'PERFIL ACTIVO': 'ACTIVE PROFILE',
    'PERFIL': 'PROFILE',
    'Configura tu identidad, función y preferencias personales dentro de Nexus.':
      'Configure your identity, role, and personal preferences in Nexus.',
    'Administrador': 'Administrator',
    'Consultor': 'Consultant',
    'Auditor': 'Auditor',
    'Responsable de seguridad': 'Security manager',
    'Responsable de cumplimiento': 'Compliance manager',
    'Dirección': 'Management',
    'Solo lectura': 'Read-only',
    'Correo': 'Email',
    'Inicial / avatar': 'Initial / avatar',
    'Preferencias personales': 'Personal preferences',
    'Guardar perfil': 'Save profile',
    'Editar mi perfil': 'Edit my profile',
    'Abrir configuración': 'Open settings',
    'El aspecto general se configura en Configuración Nexus.':
      'The general appearance is configured in Nexus settings.',
    'General': 'General',
    'Perfil': 'Profile',
    'Catálogo': 'Catalog',
    'Datos': 'Data',
    'SISTEMA': 'SYSTEM',
    'Un centro de preferencias para adaptar Nexus al perfil de trabajo, la organización y el motor GRC.':
      'A preferences hub to adapt Nexus to your work profile, organization and GRC engine.',
    'Empresa activa': 'Active organization',
    'Contexto, alcance, sector, criticidad y objetivo de madurez de la organización actual.':
      'Context, scope, industry, criticality and maturity target of the current organization.',
    'Cambiar empresa': 'Switch organization',
    'MOTOR GRC': 'GRC ENGINE',
    'Aplicabilidad y madurez': 'Applicability and maturity',
    'Las recomendaciones se calculan con el contexto de cada empresa y se mantienen separadas por proyecto.':
      'Recommendations are calculated from each organization’s context and kept separate per project.',
    'Nivel objetivo por defecto': 'Default target level',
    'Recomendar automáticamente normativa aplicable': 'Automatically recommend applicable frameworks',
    'CATÁLOGO': 'CATALOG',
    'Biblioteca Nexus': 'Nexus library',
    'DATOS': 'DATA',
    'Importar / exportar': 'Import / export',
    'Conserva o mueve proyectos completos de Nexus entre entornos.':
      'Keep or move complete Nexus projects between environments.',
    'Exportar empresa': 'Export organization',
    'COPIAS DE SEGURIDAD': 'BACKUPS',
    'Respaldo completo': 'Full backup',
    'Exporta todas las empresas, el perfil y las preferencias a un fichero JSON. El respaldo contiene datos de trabajo: guárdalo en una ubicación segura.':
      'Export all organizations, the profile and preferences to a JSON file. The backup contains working data: store it in a safe place.',
    'MANTENIMIENTO': 'MAINTENANCE',
    'Restablecer proyecto': 'Reset project',
    'Restablecer empresa activa': 'Reset active organization',
    'Elimina evaluación, acciones, evidencias, riesgos y auditorías de la empresa activa.':
      'Deletes the assessment, actions, evidence, risks and audits of the active organization.',
    'ACERCA DE NEXUS': 'ABOUT NEXUS',
    'Herramienta GRC multinorma': 'Multi-framework GRC tool',
    'Qué incluye': 'What’s included',
    'Autores y colaboradores': 'Authors and contributors',
    'Versión': 'Version',
    'Motor': 'Engine',
    'Normas': 'Frameworks',
    'LICENCIA': 'LICENSE',
    'ATRIBUCIÓN': 'ATTRIBUTION',
    'CONDICIONES DE DISTRIBUCIÓN': 'DISTRIBUTION TERMS',
    'AVISO IMPORTANTE': 'IMPORTANT NOTICE',
    'Limitaciones de uso': 'Usage limitations',
    'CÓDIGO FUENTE': 'SOURCE CODE',
    'Distribución del código': 'Code distribution',
    'Código fuente': 'Source code',
    'Licencia': 'License',
    'Atribución': 'Attribution',
    'Condiciones de distribución': 'Distribution terms',
    'Aviso importante': 'Important notice',
    'Texto completo GPL v2': 'Full GPL v2 text',
    'Tecnología, industria, financiero...': 'Technology, industry, financial...',
    'Omitir': 'Skip',
    'Sonido': 'Sound'
  };

  // Regex para textos con números / variables
  const R = [
    [/^(\d+) requisitos relacionados · nivel (\d+)\/5$/, '$1 related requirements · level $2/5'],
    [/^nivel (\d+)\/5$/, 'level $1/5'],
    [/^(\d+) de (\d+) controles$/, '$1 of $2 controls'],
    [/^(\d+) controles$/, '$1 controls'],
    [/^(\d+) requisitos? · (\d+) capacidades relacionadas$/, '$1 requirements · $2 related capabilities'],
    [/^(\d+) requisitos$/, '$1 requirements'],
    [/^(\d+) seleccionadas?$/, '$1 selected'],
    [/^Eliminar seleccionadas \((\d+)\)$/, 'Delete selected ($1)'],
    [/^REQUISITOS · (\d+)$/, 'REQUIREMENTS · $1'],
    [/^NORMAS$/, 'FRAMEWORKS'],
    [/^Ver los (\d+) requisitos en (.+)$/, 'See all $1 requirements in $2'],
    [/^Impacto (\d+) · Probabilidad (\d+) · Inherente (\d+\/25)$/, 'Impact $1 · Likelihood $2 · Inherent $3'],
    [/^Objetivo actual: (.+)$/, 'Current target: $1'],
    [/^(\d+) asunto\(s\) requieren atención\.$/, '$1 item(s) need attention.']
  ];

  const keys = Object.keys(T);
  const exact = new Map(keys.map(k => [k, T[k]]));
  // Sustitución por subcadena solo para frases largas (evita romper palabras)
  const long = keys.filter(k => k.length >= 28).sort((a, b) => b.length - a.length);

  const norm = s => s.replace(/\s+/g, ' ').trim();

  function seg(s) {
    if (exact.has(s)) return exact.get(s);
    for (const [re, rep] of R) if (re.test(s)) return s.replace(re, rep);
    let m = s.match(/^(\d+(?:[.,]\d+)?%?)\s+(.+)$/);
    if (m && exact.has(m[2])) return m[1] + ' ' + exact.get(m[2]);
    m = s.match(/^(.+?)\s*:$/);
    if (m && exact.has(m[1])) return exact.get(m[1]) + ':';
    return null;
  }

  function translateCore(s) {
    const n = norm(s);
    if (!n) return null;
    let r = seg(n);
    if (r === null && n.includes(' · ')) {
      let changed = false;
      const parts = n.split(' · ').map(p => {
        const t = seg(p);
        if (t !== null) { changed = true; return t; }
        return p;
      });
      if (changed) r = parts.join(' · ');
    }
    if (r === null) {
      let out = n, hit = false;
      for (const k of long) {
        if (out.includes(k)) { out = out.split(k).join(T[k]); hit = true; }
      }
      if (hit) r = out;
    }
    return r;
  }

  function isEnglish() {
    try { return typeof db !== 'undefined' && db.settings && db.settings.language === 'en'; }
    catch (_) { return false; }
  }

  function translate(value) {
    if (typeof value !== 'string' || !value || !isEnglish()) return value;
    const r = translateCore(value);
    if (r === null) return value;
    const lead = (value.match(/^\s*/) || [''])[0];
    const trail = (value.match(/\s*$/) || [''])[0];
    return lead + r + trail;
  }

  const ATTRS = ['placeholder', 'title', 'aria-label', 'alt'];
  const SKIP = ['SCRIPT', 'STYLE', 'TEXTAREA', 'CODE', 'PRE'];

  function visit(node) {
    if (node.nodeType === 3) {
      const p = node.parentElement;
      if (p && SKIP.includes(p.tagName)) return;
      const t = translate(node.nodeValue);
      if (t !== node.nodeValue) node.nodeValue = t;
      return;
    }
    if (node.nodeType !== 1 || SKIP.includes(node.tagName)) return;
    for (const a of ATTRS) {
      const v = node.getAttribute(a);
      if (v) { const t = translate(v); if (t !== v) node.setAttribute(a, t); }
    }
    for (const ch of Array.from(node.childNodes)) visit(ch);
  }

  function applyLanguage() {
    if (!document.body) return;
    if (!isEnglish()) { document.documentElement.lang = 'es'; return; }
    document.documentElement.lang = 'en';
    visit(document.body);
  }

  let scheduled = false;
  function schedule() {
    if (scheduled) return;
    scheduled = true;
    Promise.resolve().then(() => { scheduled = false; applyLanguage(); });
  }

  function start() {
    applyLanguage();
    if (typeof MutationObserver !== 'undefined') {
      new MutationObserver(schedule).observe(document.body, {
        subtree: true, childList: true, characterData: true,
        attributes: true, attributeFilter: ATTRS
      });
    }
  }

  window.nexusTranslate = translate;
  window.nexusApplyLanguage = applyLanguage;

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();

  window.addEventListener('languagechange', applyLanguage);
})();
