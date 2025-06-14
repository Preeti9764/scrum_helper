// Initialize settings UI
document.addEventListener('DOMContentLoaded', () => {
  // Load and apply settings
  loadSettings().then(({ settings, templates }) => {
    // Initialize section toggles
    Object.keys(settings.sections).forEach(section => {
      const toggle = document.getElementById(`toggle-${section}`);
      if (toggle) {
        toggle.checked = settings.sections[section];
        toggle.addEventListener('change', () => {
          settings.sections[section] = toggle.checked;
          saveSettings(settings).then(() => {
            // Keep original behavior - regenerate report
            const generateBtn = document.getElementById('generateReport');
            if (generateBtn) {
              generateBtn.click();
            }
          });
        });
      }
    });

    // Initialize filters
    document.getElementById('filter-open-only').checked = settings.filters.openOnly;
    document.getElementById('filter-exclude-drafts').checked = settings.filters.excludeDrafts;

    // Add filter change listeners
    ['filter-open-only', 'filter-exclude-drafts'].forEach(filterId => {
      const filter = document.getElementById(filterId);
      filter.addEventListener('change', () => {
        settings.filters.openOnly = document.getElementById('filter-open-only').checked;
        settings.filters.excludeDrafts = document.getElementById('filter-exclude-drafts').checked;
        saveSettings(settings).then(() => {
          // Keep original behavior - regenerate report
          const generateBtn = document.getElementById('generateReport');
          if (generateBtn) {
            generateBtn.click();
          }
        });
      });
    });

    // Initialize template list
    refreshTemplateList(templates);
  });

  // Template save button
  document.getElementById('save-template').addEventListener('click', () => {
    const name = document.getElementById('template-name').value.trim();
    if (!name) {
      Materialize.toast('Please enter a template name', 3000);
      return;
    }

    // Check for invalid characters in template name
    const invalidChars = /[<>:"/\\|?*\x00-\x1F]/;
    if (invalidChars.test(name)) {
      Materialize.toast('Template name contains invalid characters', 3000);
      return;
    }

    loadSettings().then(({ settings, templates }) => {
      // Check if template with this name already exists
      if (templates && templates[name]) {
        // Show confirmation dialog
        if (!confirm(`A template named "${name}" already exists. Do you want to replace it?`)) {
          return; // User clicked Cancel
        }
      }

      saveTemplate(name, settings).then(() => {
        document.getElementById('template-name').value = '';
        Materialize.toast('Template saved successfully', 3000);
        refreshTemplateList();
      });
    });
  });
});

// Refresh template list
function refreshTemplateList() {
  const templateList = document.querySelector('.template-list');

  loadSettings().then(({ templates }) => {
    templateList.innerHTML = '';

    if (!templates || Object.keys(templates).length === 0) {
      const emptyMessage = document.createElement('div');
      emptyMessage.className = 'center-align grey-text';
      emptyMessage.style.padding = '20px';
      emptyMessage.textContent = 'No saved templates';
      templateList.appendChild(emptyMessage);
      return;
    }

    Object.keys(templates).sort().forEach(name => {
      const templateItem = document.createElement('div');
      templateItem.className = 'template-item';

      const templateName = document.createElement('span');
      templateName.textContent = name;
      templateName.title = 'Created: ' + new Date(templates[name].timestamp || Date.now()).toLocaleString();
      templateItem.appendChild(templateName);

      const actionDiv = document.createElement('div');
      actionDiv.className = 'template-actions';

      // Load button
      const loadBtn = document.createElement('button');
      loadBtn.className = 'btn-small waves-effect waves-light';
      loadBtn.innerHTML = '<i class="fa fa-check"></i>';
      loadBtn.title = 'Load template';
      loadBtn.addEventListener('click', () => {
        loadTemplate(name).then(settings => {
          if (settings) {
            saveSettings(settings).then(() => {
              Materialize.toast('Template loaded successfully', 3000);
              // Refresh UI and report
              location.reload();
            });
          }
        });
      });

      // Delete button
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'btn-small waves-effect waves-light red';
      deleteBtn.innerHTML = '<i class="fa fa-trash"></i>';
      deleteBtn.title = 'Delete template';
      deleteBtn.addEventListener('click', () => {
        if (confirm(`Are you sure you want to delete the template "${name}"?`)) {
          deleteTemplate(name).then(() => {
            Materialize.toast('Template deleted successfully', 3000);
            refreshTemplateList();
          });
        }
      });

      actionDiv.appendChild(loadBtn);
      actionDiv.appendChild(deleteBtn);
      templateItem.appendChild(actionDiv);

      templateList.appendChild(templateItem);
    });
  });
}