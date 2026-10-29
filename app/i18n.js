// Nexus GRC Lion — traducciones ES/EN
(function () {
  'use strict';

  const translations = {
    'Mis empresas': 'My organizations',
    'Nueva empresa': 'New organization',
    'Nueva organización': 'New organization',
    'Crear primera organización': 'Create your first organization',
    'Editar datos': 'Edit details',
    'Editar organización': 'Edit organization',
    'Eliminar': 'Delete',
    'Cancelar': 'Cancel',
    'Guardar': 'Save',
    'Guardar cambios': 'Save changes',
    'Abrir organización': 'Open organization',
    'ORGANIZACIÓN ACTIVA': 'ACTIVE ORGANIZATION',
    'ORGANIZACIÓN': 'ORGANIZATION',
    'ESPACIO DE TRABAJO': 'WORKSPACE',
    'BIENVENIDO': 'WELCOME',
    'Inicio': 'Home',
    'Nombre': 'Name',
    'Organización': 'Organization',
    'Empresa': 'Organization',
    'Sector': 'Industry',
    'Tamaño': 'Size',
    'Empleados': 'Employees',
    'Criticidad': 'Criticality',
    'Categoría ENS': 'ENS category',
    'Sin determinar': 'Not specified',
    'Sector no definido': 'Industry not specified',
    'Sin tamaño': 'Size not specified',
    'Pequeña': 'Small',
    'Mediana': 'Medium',
    'Grande': 'Large',
    'Baja': 'Low',
    'Media': 'Medium',
    'Alta': 'High',
    'Activa': 'Active',
    'Evaluaciones': 'Assessments',
    'Acciones': 'Actions',
    'normas seleccionadas': 'selected frameworks',
    'organizaciones guardadas': 'organizations saved',
    'Aún no hay ninguna empresa': 'There are no organizations yet',
    'Aún no tienes organizaciones': 'You do not have any organizations yet',
    'Empieza por crear tu organización': 'Start by creating your organization',
    'Crear una organización': 'Create an organization',
    'Importar organización': 'Import organization',
    'Cargar empresa de ejemplo': 'Load demo organization',
    'Gestiona tus organizaciones, abre un proyecto o modifica sus datos.':
      'Manage your organizations, open a project, or edit their details.',
    'Cada organización mantiene sus propias evaluaciones, normas, evidencias y acciones.':
      'Each organization has its own assessments, frameworks, evidence, and actions.',
    'Crea una organización para empezar a trabajar con tus evaluaciones GRC.':
      'Create an organization to start working with your GRC assessments.',
    'Contexto de la empresa': 'Organization details',
    'Guardar contexto y calcular alcance': 'Save details and calculate scope',
    'Todo se guarda en este navegador. Puedes eliminar y volver a crear empresas cuando quieras.':
      'Everything is saved in this browser. You can delete and recreate organizations at any time.',
    'Eliminar organización': 'Delete organization',
    '¿Estás seguro?': 'Are you sure?',
    'Buscar': 'Search',
    'Idioma': 'Language',
    'Español': 'Spanish',
    'Inglés': 'English',
    'Tema': 'Theme',
    'Claro': 'Light',
    'Oscuro': 'Dark',
    'Mi perfil': 'My profile',
    'Configuración Nexus': 'Nexus settings',
    'Panel multinorma': 'Multi-framework dashboard',
    'Informe imprimible': 'Printable report',
    'Normativa aplicable': 'Applicable frameworks',
    'Biblioteca multinorma': 'Multi-framework library',
    'Equivalencias': 'Equivalences',
    'Comparar normas': 'Compare frameworks',
    'Requisitos': 'Requirements',
    'Controles': 'Controls',
    'Situación actual': 'Current status',
    'Madurez': 'Maturity',
    'Plan de acción': 'Action plan',
    'Evidencias': 'Evidence',
    'Riesgos': 'Risks',
    'Auditoría': 'Audit',
    'Acerca de': 'About',
    'Configuración': 'Settings',
    'Cerrar menú': 'Close menu',
    'Todos los cambios guardados': 'All changes saved'
  };

  const phrases = Object.keys(translations)
    .sort((a, b) => b.length - a.length);

  function isEnglish() {
    try {
      return window.db?.settings?.language === 'en';
    } catch (_) {
      return false;
    }
  }

  function translate(value) {
    if (typeof value !== 'string' || !value || !isEnglish()) {
      return value;
    }

    const trimmed = value.trim();

    if (translations[trimmed]) {
      return value.replace(trimmed, translations[trimmed]);
    }

    let result = value;

    for (const phrase of phrases) {
      if (result.includes(phrase)) {
        result = result.split(phrase).join(translations[phrase]);
      }
    }

    return result;
  }

  const attributes = [
    'placeholder',
    'title',
    'aria-label',
    'alt'
  ];

  function visit(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const parent = node.parentElement;

      if (
        parent &&
        ['SCRIPT', 'STYLE', 'TEXTAREA'].includes(parent.tagName)
      ) {
        return;
      }

      const translated = translate(node.nodeValue);

      if (translated !== node.nodeValue) {
        node.nodeValue = translated;
      }

      return;
    }

    if (
      node.nodeType !== Node.ELEMENT_NODE ||
      ['SCRIPT', 'STYLE'].includes(node.tagName)
    ) {
      return;
    }

    for (const attribute of attributes) {
      const value = node.getAttribute(attribute);

      if (value) {
        const translated = translate(value);

        if (translated !== value) {
          node.setAttribute(attribute, translated);
        }
      }
    }

    if (
      node.tagName === 'INPUT' &&
      ['button', 'submit'].includes(node.type)
    ) {
      const translated = translate(node.value);

      if (translated !== node.value) {
        node.value = translated;
      }
    }

    for (const child of Array.from(node.childNodes)) {
      visit(child);
    }
  }

  function applyLanguage() {
    if (!document.body) return;

    if (!isEnglish()) {
      document.documentElement.lang = 'es';
      return;
    }

    visit(document.body);
    document.documentElement.lang = 'en';
  }

  let scheduled = false;

  function scheduleTranslation() {
    if (scheduled) return;

    scheduled = true;

    queueMicrotask(() => {
      scheduled = false;
      applyLanguage();
    });
  }

  function start() {
    applyLanguage();

    if (typeof MutationObserver !== 'undefined') {
      const observer = new MutationObserver(scheduleTranslation);

      observer.observe(document.body, {
        subtree: true,
        childList: true,
        characterData: true,
        attributes: true,
        attributeFilter: attributes
      });
    }
  }

  window.nexusTranslate = translate;
  window.nexusApplyLanguage = applyLanguage;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }

  window.addEventListener('languagechange', applyLanguage);
})();
