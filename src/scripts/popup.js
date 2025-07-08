function getLastWeek() {
    let today = new Date();
    let lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
    let lastWeekMonth = lastWeek.getMonth() + 1;
    let lastWeekDay = lastWeek.getDate();
    let lastWeekYear = lastWeek.getFullYear();
    let lastWeekDisplayPadded =
        ('0000' + lastWeekYear.toString()).slice(-4) +
        '-' +
        ('00' + lastWeekMonth.toString()).slice(-2) +
        '-' +
        ('00' + lastWeekDay.toString()).slice(-2);
    return lastWeekDisplayPadded;
}

function getToday() {
    let today = new Date();
    let WeekMonth = today.getMonth() + 1;
    let WeekDay = today.getDate();
    let WeekYear = today.getFullYear();
    let WeekDisplayPadded =
        ('0000' + WeekYear.toString()).slice(-4) +
        '-' +
        ('00' + WeekMonth.toString()).slice(-2) +
        '-' +
        ('00' + WeekDay.toString()).slice(-2);
    return WeekDisplayPadded;
}

function getYesterday() {
    let today = new Date();
    let yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
    let yesterdayMonth = yesterday.getMonth() + 1;
    let yesterdayDay = yesterday.getDate();
    let yesterdayYear = yesterday.getFullYear();
    let yesterdayPadded =
        ('0000' + yesterdayYear.toString()).slice(-4) +
        '-' +
        ('00' + yesterdayMonth.toString()).slice(-2) +
        '-' +
        ('00' + yesterdayDay.toString()).slice(-2);
    return yesterdayPadded;
}

document.addEventListener('DOMContentLoaded', function () {
    // Dark mode setup
    const darkModeToggle = document.querySelector('img[alt="Night Mode"]');
    const settingsIcon = document.getElementById('settingsIcon');
    const body = document.body;
    const homeButton = document.getElementById('homeButton');
    const scrumHelperHeading = document.getElementById('scrumHelperHeading');
    const settingsToggle = document.getElementById('settingsToggle');
    const reportSection = document.getElementById('reportSection');
    const settingsSection = document.getElementById('settingsSection');

    let isSettingsVisible = false;
    const githubTokenInput = document.getElementById('githubToken');
    const toggleTokenBtn = document.getElementById('toggleTokenVisibility');
    const tokenEyeIcon = document.getElementById('tokenEyeIcon');
    let tokenVisible = false;

    const orgInput = document.getElementById('orgInput');
    const setOrgBtn = document.getElementById('setOrgBtn');

    chrome.storage.local.get(['darkMode'], function (result) {
        if (result.darkMode) {
            body.classList.add('dark-mode');
            darkModeToggle.src = 'icons/light-mode.png';
            if (settingsIcon) {
                settingsIcon.src = 'icons/settings-night.png'; // Changed from settings-night.png
            }
        }
    });

    toggleTokenBtn.addEventListener('click', function () {
        tokenVisible = !tokenVisible;
        githubTokenInput.type = tokenVisible ? 'text' : 'password';

        tokenEyeIcon.classList.add('eye-animating');
        setTimeout(() => tokenEyeIcon.classList.remove('eye-animating'), 400);
        tokenEyeIcon.className = tokenVisible ? 'fa fa-eye-slash text-gray-600' : 'fa fa-eye text-gray-600';

        githubTokenInput.classList.add('token-animating');
        setTimeout(() => githubTokenInput.classList.remove('token-animating'), 300);
    });

    darkModeToggle.addEventListener('click', function () {
        body.classList.toggle('dark-mode');
        const isDarkMode = body.classList.contains('dark-mode');
        chrome.storage.local.set({ darkMode: isDarkMode });
        this.src = isDarkMode ? 'icons/light-mode.png' : 'icons/night-mode.png';
        const settingsIcon = document.getElementById('settingsIcon');
        if (settingsIcon) {
            settingsIcon.src = isDarkMode ? 'icons/settings-night.png' : 'icons/settings-light.png';
        }
        renderTokenPreview();
    });

    function renderTokenPreview() {
        tokenPreview.innerHTML = '';
        const value = githubTokenInput.value;
        const isDark = document.body.classList.contains('dark-mode');
        for (let i = 0; i < value.length; i++) {
            const charBox = document.createElement('span');
            charBox.className = 'token-preview-char' + (isDark ? ' dark-mode' : '');
            if (tokenVisible) {
                charBox.textContent = value[i];
            } else {
                const dot = document.createElement('span');
                dot.className = 'token-preview-dot' + (isDark ? ' dark-mode' : '');
                charBox.appendChild(dot);
            }
            tokenPreview.appendChild(charBox);
            setTimeout(() => charBox.classList.add('flip'), 10 + i * 30);
        }
    }

    function updateContentState(enableToggle) {
        const elementsToToggle = [
            'startingDate',
            'endingDate',
            'userReason',
            'generateReport',
            'copyReport',
            'refreshCache',
            'showOpenLabel',
            'scrumReport',
            'githubUsername',
            'githubToken',
            'projectName',
            'settingsToggle',

        ];

        const radios = document.querySelectorAll('input[name="timeframe"]');
        const customDateContainer = document.getElementById('customDateContainer');

        elementsToToggle.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.disabled = !enableToggle;
                if (!enableToggle) {
                    element.style.opacity = '0.5';
                    element.style.pointerEvents = 'none';
                } else {
                    element.style.opacity = '1';
                    element.style.pointerEvents = 'auto';
                }
            }
        });

        radios.forEach(radio => {
            radio.disabled = !enableToggle;
            const label = document.querySelector(`label[for="${radio.id}"]`);
            if (label) {
                if (!enableToggle) {
                    label.style.opacity = '0.5';
                    label.style.pointerEvents = 'none';
                } else {
                    label.style.opacity = '1';
                    label.style.pointerEvents = 'auto';
                }
            }
        });


        if (customDateContainer) {
            if (!enableToggle) {
                customDateContainer.style.opacity = '0.5';
                customDateContainer.style.pointerEvents = 'none';
            } else {
                customDateContainer.style.opacity = '1';
                customDateContainer.style.pointerEvents = 'auto';
            }
        }

        const scrumReport = document.getElementById('scrumReport');
        if (scrumReport) {
            scrumReport.contentEditable = enableToggle;
            if (!enableToggle) {
                scrumReport.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">Extension is disabled. Enable it from the options to generate scrum reports.</p>';
            } else {
                const disabledMessage = '<p style="text-align: center; color: #999; padding: 20px;">Extension is disabled. Enable it from the options to generate scrum reports.</p>';
                if (scrumReport.innerHTML === disabledMessage) {
                    scrumReport.innerHTML = '';
                }
            }
        }
    }

    chrome.storage.local.get(['enableToggle'], (items) => {
        const enableToggle = items.enableToggle !== false;
        updateContentState(enableToggle);
        if (!enableToggle) {
            return;
        }

        initializePopup();
    })

    chrome.storage.onChanged.addListener((changes, namespace) => {
        if (namespace === 'local' && changes.enableToggle) {
            updateContentState(changes.enableToggle.newValue);
            if (changes.enableToggle.newValue) {
                // re-initialize if enabled
                initializePopup();
            }
        }
    });

    function initializePopup() {

        // Button setup
        const generateBtn = document.getElementById('generateReport');
        const copyBtn = document.getElementById('copyReport');

        generateBtn.addEventListener('click', function () {
            // Check org input value before generating report
            let org = orgInput.value.trim().toLowerCase();
            // Allow empty org to fetch all GitHub activities
            chrome.storage.local.set({ orgName: org }, () => {
                generateBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Generating...';
                generateBtn.disabled = true;
                window.generateScrumReport();
            });
        });

        copyBtn.addEventListener('click', function () {
            const scrumReport = document.getElementById('scrumReport');
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = scrumReport.innerHTML;
            document.body.appendChild(tempDiv);
            tempDiv.style.position = 'absolute';
            tempDiv.style.left = '-9999px';

            const range = document.createRange();
            range.selectNode(tempDiv);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);

            try {
                document.execCommand('copy');
                this.innerHTML = '<i class="fa fa-check"></i> Copied!';
                setTimeout(() => {
                    this.innerHTML = '<i class="fa fa-copy"></i> Copy Report';
                }, 2000);
            } catch (err) {
                console.error('Failed to copy: ', err);
            } finally {
                selection.removeAllRanges();
                document.body.removeChild(tempDiv);
            }
        });

        // Custom date container click handler
        document.getElementById('customDateContainer').addEventListener('click', () => {
            document.querySelectorAll('input[name="timeframe"]').forEach(radio => {
                radio.checked = false
                radio.dataset.wasChecked = 'false'
            });

            const startDateInput = document.getElementById('startingDate');
            const endDateInput = document.getElementById('endingDate');
            startDateInput.readOnly = false;
            endDateInput.readOnly = false;

            chrome.storage.local.set({
                lastWeekContribution: false,
                yesterdayContribution: false,
                selectedTimeframe: null
            });
        });

        chrome.storage.local.get([
            'selectedTimeframe',
            'lastWeekContribution',
            'yesterdayContribution',
            'startingDate',
            'endingDate',
        ], (items) => {
            console.log('Restoring state:', items);


            if (items.startingDate && items.endingDate && !items.lastWeekContribution && !items.yesterdayContribution) {
                const startDateInput = document.getElementById('startingDate');
                const endDateInput = document.getElementById('endingDate');

                if (startDateInput && endDateInput) {

                    startDateInput.value = items.startingDate;
                    endDateInput.value = items.endingDate;
                    startDateInput.readOnly = false;
                    endDateInput.readOnly = false;
                }
                document.querySelectorAll('input[name="timeframe"]').forEach(radio => {
                    radio.checked = false;
                    radio.dataset.wasChecked = 'false';
                })
                return;
            }

            if (!items.selectedTimeframe) {
                items.selectedTimeframe = 'yesterdayContribution';
                items.lastWeekContribution = false;
                items.yesterdayContribution = true;
            }

            const radio = document.getElementById(items.selectedTimeframe);
            if (radio) {
                radio.checked = true;
                radio.dataset.wasChecked = 'true';

                const startDateInput = document.getElementById('startingDate');
                const endDateInput = document.getElementById('endingDate');

                if (items.selectedTimeframe === 'lastWeekContribution') {
                    startDateInput.value = getLastWeek();
                    endDateInput.value = getToday();
                } else {
                    startDateInput.value = getYesterday();
                    endDateInput.value = getToday();
                }
                startDateInput.readOnly = endDateInput.readOnly = true;

                chrome.storage.local.set({
                    startingDate: startDateInput.value,
                    endingDate: endDateInput.value,
                    lastWeekContribution: items.selectedTimeframe === 'lastWeekContribution',
                    yesterdayContribution: items.selectedTimeframe === 'yesterdayContribution',
                    selectedTimeframe: items.selectedTimeframe
                });
            }
        });
    }

    function showReportView() {
        isSettingsVisible = false;
        reportSection.classList.remove('hidden');
        settingsSection.classList.add('hidden');
        settingsToggle.classList.remove('active');
        console.log('Switched to report view');
    }

    function showSettingsView() {
        isSettingsVisible = true;
        reportSection.classList.add('hidden');
        settingsSection.classList.remove('hidden');
        settingsToggle.classList.add('active');
        console.log('Switched to settings view');
    }

    if (settingsToggle) {
        settingsToggle.addEventListener('click', function () {
            if (isSettingsVisible) {
                showReportView();
            } else {
                showSettingsView();
            }
        });
    }

    if (homeButton) {
        homeButton.addEventListener('click', showReportView);
    }
    if (scrumHelperHeading) {
        scrumHelperHeading.addEventListener('click', showReportView);
    }

    showReportView();

    // Load org from storage or default
    chrome.storage.local.get(['orgName'], function (result) {
        orgInput.value = result.orgName || '';
    });

    // Auto-update orgName in storage on input change
    orgInput.addEventListener('input', function () {
        let org = orgInput.value.trim().toLowerCase();
        // Allow empty org to fetch all GitHub activities
        chrome.storage.local.set({ orgName: org }, function () {
            chrome.storage.local.remove('githubCache'); // Clear cache on org change
        });
    });

    // Add click event for setOrgBtn to set org
    setOrgBtn.addEventListener('click', function () {
        let org = orgInput.value.trim().toLowerCase();
        // Do not default to any org, allow empty string
        // if (!org) {
        //     org = 'fossasia';
        // }
        console.log('[Org Check] Checking organization:', org);
        if (!org) {
            // If org is empty, clear orgName in storage but don't auto-generate report
            chrome.storage.local.set({ orgName: '' }, function () {
                console.log('[Org Check] Organization cleared from storage');
            });
            return;
        }

        setOrgBtn.disabled = true;
        const originalText = setOrgBtn.innerHTML;
        setOrgBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i>';

        fetch(`https://api.github.com/orgs/${org}`)
            .then(res => {
                if (res.status === 404) {
                    setOrgBtn.disabled = false;
                    setOrgBtn.innerHTML = originalText;
                    const oldToast = document.getElementById('invalid-org-toast');
                    if (oldToast) oldToast.parentNode.removeChild(oldToast);
                    const toastDiv = document.createElement('div');
                    toastDiv.id = 'invalid-org-toast';
                    toastDiv.className = 'toast';
                    toastDiv.style.background = '#dc2626';
                    toastDiv.style.color = '#fff';
                    toastDiv.style.fontWeight = 'bold';
                    toastDiv.style.padding = '12px 24px';
                    toastDiv.style.borderRadius = '8px';
                    toastDiv.style.position = 'fixed';
                    toastDiv.style.top = '24px';
                    toastDiv.style.left = '50%';
                    toastDiv.style.transform = 'translateX(-50%)';
                    toastDiv.style.zIndex = '9999';
                    toastDiv.innerText = 'Organization not found on GitHub.';
                    document.body.appendChild(toastDiv);
                    setTimeout(() => {
                        if (toastDiv.parentNode) toastDiv.parentNode.removeChild(toastDiv);
                    }, 3000);
                    return;
                }
                const oldToast = document.getElementById('invalid-org-toast');
                if (oldToast) oldToast.parentNode.removeChild(oldToast);

                chrome.storage.local.set({ orgName: org }, function () {
                    // Always clear the scrum report and show org changed message
                    const scrumReport = document.getElementById('scrumReport');
                    if (scrumReport) {
                        scrumReport.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">Organization changed. Click Generate button to fetch the GitHub activities.</p>';
                    }
                    // Clear the githubCache for previous org
                    chrome.storage.local.remove('githubCache');
                    setOrgBtn.disabled = false;
                    setOrgBtn.innerHTML = originalText;
                    // Always show green toast: org is set
                    const toastDiv = document.createElement('div');
                    toastDiv.id = 'invalid-org-toast';
                    toastDiv.className = 'toast';
                    toastDiv.style.background = '#10b981';
                    toastDiv.style.color = '#fff';
                    toastDiv.style.fontWeight = 'bold';
                    toastDiv.style.padding = '12px 24px';
                    toastDiv.style.borderRadius = '8px';
                    toastDiv.style.position = 'fixed';
                    toastDiv.style.top = '24px';
                    toastDiv.style.left = '50%';
                    toastDiv.style.transform = 'translateX(-50%)';
                    toastDiv.style.zIndex = '9999';
                    toastDiv.innerText = 'Organization is set.';
                    document.body.appendChild(toastDiv);
                    setTimeout(() => {
                        if (toastDiv.parentNode) toastDiv.parentNode.removeChild(toastDiv);
                    }, 2500);

                });
            })
            .catch((err) => {
                setOrgBtn.disabled = false;
                setOrgBtn.innerHTML = originalText;
                const oldToast = document.getElementById('invalid-org-toast');
                if (oldToast) oldToast.parentNode.removeChild(oldToast);
                const toastDiv = document.createElement('div');
                toastDiv.id = 'invalid-org-toast';
                toastDiv.className = 'toast';
                toastDiv.style.background = '#dc2626';
                toastDiv.style.color = '#fff';
                toastDiv.style.fontWeight = 'bold';
                toastDiv.style.padding = '12px 24px';
                toastDiv.style.borderRadius = '8px';
                toastDiv.style.position = 'fixed';
                toastDiv.style.top = '24px';
                toastDiv.style.left = '50%';
                toastDiv.style.transform = 'translateX(-50%)';
                toastDiv.style.zIndex = '9999';
                toastDiv.innerText = 'Error validating organization.';
                document.body.appendChild(toastDiv);
                setTimeout(() => {
                    if (toastDiv.parentNode) toastDiv.parentNode.removeChild(toastDiv);
                }, 3000);
            });
    });

    let cacheInput = document.getElementById('cacheInput');
    if (cacheInput) {
        chrome.storage.local.get(['cacheInput'], function (result) {
            if (result.cacheInput) {
                cacheInput.value = result.cacheInput;
            } else {
                cacheInput.value = 10;
            }
        });

        cacheInput.addEventListener('blur', function () {
            let ttlValue = parseInt(this.value);
            if (isNaN(ttlValue) || ttlValue <= 0 || this.value.trim() === '') {
                ttlValue = 10;
                this.value = ttlValue;
                this.style.borderColor = '#ef4444';
            } else if (ttlValue > 1440) {
                ttlValue = 1440;
                this.value = ttlValue;
                this.style.borderColor = '#f59e0b';
            } else {
                this.style.borderColor = '#10b981';
            }

            chrome.storage.local.set({ cacheInput: ttlValue }, function () {
                console.log('Cache TTL saved:', ttlValue, 'minutes');
            });
        });

    }

    // --- Customization Template Logic ---
    const customizationDefaults = {
        showBlockers: true,
        showTasks: true,
        showPRs: true,
        showIssues: true,
        showReviewedPRs: true,
    };
    const customizationKeys = Object.keys(customizationDefaults);
    const customizationCheckboxes = {
        showBlockers: document.getElementById('showBlockers'),
        showTasks: document.getElementById('showTasks'),
        showPRs: document.getElementById('showPRs'),
        showIssues: document.getElementById('showIssues'),
        showReviewedPRs: document.getElementById('showReviewedPRs'),
    };

    function loadCustomizationTemplate() {
        chrome.storage.local.get(['customizationTemplate'], function (result) {
            const prefs = result.customizationTemplate || customizationDefaults;
            for (const key of customizationKeys) {
                if (key.startsWith('show')) {
                    if (customizationCheckboxes[key]) {
                        customizationCheckboxes[key].checked = prefs[key] !== false;
                    }
                }
            }
        });
    }

    function saveCustomizationTemplate() {
        const prefs = {};
        for (const key of customizationKeys) {
            if (key.startsWith('show')) {
                prefs[key] = customizationCheckboxes[key] ? customizationCheckboxes[key].checked : true;
            }
        }
        chrome.storage.local.set({ customizationTemplate: prefs }, function () {
            if (templateSavedMsg) {
                templateSavedMsg.style.display = 'inline';
                setTimeout(() => { templateSavedMsg.style.display = 'none'; }, 1500);
            }
        });
    }

    if (saveTemplateBtn) {
        saveTemplateBtn.addEventListener('click', saveCustomizationTemplate);
    }
    loadCustomizationTemplate();

    // --- Named Template Management ---
    const templateNameInput = document.getElementById('templateNameInput');
    const saveNamedTemplateBtn = document.getElementById('saveNamedTemplateBtn');
    const templatesList = document.getElementById('templatesList');
    const namedTemplateMsg = document.getElementById('namedTemplateMsg');
    const loadTemplateBtn = document.getElementById('loadTemplateBtn');
    const deleteTemplateBtn = document.getElementById('deleteTemplateBtn');
    let selectedTemplateName = null;

    function getCurrentCustomizationConfig() {
        const prefs = {};
        for (const key of customizationKeys) {
            if (key.startsWith('show')) {
                prefs[key] = customizationCheckboxes[key] ? customizationCheckboxes[key].checked : true;
            }
        }
        return prefs;
    }

    function updateTemplatesListUI(selectedName = null) {
        chrome.storage.local.get(['templates'], function (result) {
            const templates = result.templates || {};
            templatesList.innerHTML = '';
            Object.keys(templates).forEach(name => {
                const li = document.createElement('li');
                li.className = 'flex flex-row items-center gap-2 px-2 py-1 rounded hover:bg-blue-100';
                const nameSpan = document.createElement('span');
                nameSpan.textContent = name;
                if (name === selectedName) {
                    li.classList.add('bg-blue-200');
                }
                // Load button
                const loadBtn = document.createElement('button');
                loadBtn.title = 'Load Template';
                loadBtn.className = 'text-green-600 hover:text-green-800 px-2 py-1 rounded';
                loadBtn.innerHTML = '<i class="fa fa-play"></i>';
                loadBtn.addEventListener('click', function (e) {
                    e.stopPropagation();
                    const config = templates[name];
                    if (!config) return;
                    for (const key of customizationKeys) {
                        if (key.startsWith('show')) {
                            if (customizationCheckboxes[key]) {
                                customizationCheckboxes[key].checked = config[key] !== false;
                            }
                        }
                    }
                    chrome.storage.local.set({ customizationTemplate: config }, function () {
                        showNamedTemplateMsg('Template loaded!');
                    });
                });
                // Delete button
                const deleteBtn = document.createElement('button');
                deleteBtn.title = 'Delete Template';
                deleteBtn.className = 'text-red-600 hover:text-red-800 px-2 py-1 rounded';
                deleteBtn.innerHTML = '<i class="fa fa-trash"></i>';
                deleteBtn.addEventListener('click', function (e) {
                    e.stopPropagation();
                    delete templates[name];
                    chrome.storage.local.set({ templates }, function () {
                        updateTemplatesListUI();
                        showNamedTemplateMsg('Template deleted!');
                    });
                });
                li.appendChild(nameSpan);
                li.appendChild(loadBtn);
                li.appendChild(deleteBtn);
                templatesList.appendChild(li);
            });
        });
    }

    function showNamedTemplateMsg(msg) {
        if (namedTemplateMsg) {
            namedTemplateMsg.textContent = msg;
            namedTemplateMsg.style.display = 'inline';
            setTimeout(() => { namedTemplateMsg.style.display = 'none'; }, 1500);
        }
    }

    if (saveNamedTemplateBtn) {
        saveNamedTemplateBtn.addEventListener('click', function () {
            const name = templateNameInput.value.trim();
            if (!name) {
                showNamedTemplateMsg('Enter a template name!');
                return;
            }
            const config = getCurrentCustomizationConfig();
            chrome.storage.local.get(['templates'], function (result) {
                const templates = result.templates || {};
                templates[name] = config;
                chrome.storage.local.set({ templates }, function () {
                    showNamedTemplateMsg('Template saved!');
                    updateTemplatesListUI(name);
                });
            });
        });
    }

    if (loadTemplateBtn) {
        loadTemplateBtn.addEventListener('click', function () {
            if (!selectedTemplateName) return;
            chrome.storage.local.get(['templates'], function (result) {
                const templates = result.templates || {};
                const config = templates[selectedTemplateName];
                if (!config) return;
                // Apply config to UI
                for (const key of customizationKeys) {
                    if (key.startsWith('show')) {
                        if (customizationCheckboxes[key]) {
                            customizationCheckboxes[key].checked = config[key] !== false;
                        }
                    }
                }
                // Save as current customizationTemplate
                chrome.storage.local.set({ customizationTemplate: config }, function () {
                    showNamedTemplateMsg('Template loaded!');
                });
            });
        });
    }

    if (deleteTemplateBtn) {
        deleteTemplateBtn.addEventListener('click', function () {
            if (!selectedTemplateName) return;
            chrome.storage.local.get(['templates'], function (result) {
                const templates = result.templates || {};
                if (!templates[selectedTemplateName]) return;
                delete templates[selectedTemplateName];
                chrome.storage.local.set({ templates }, function () {
                    selectedTemplateName = null;
                    updateTemplatesListUI();
                    showNamedTemplateMsg('Template deleted!');
                });
            });
        });
    }

    updateTemplatesListUI();

    // Add event listener for showOpenLabel checkbox to save its value
    const showOpenLabelCheckbox = document.getElementById('showOpenLabel');
    if (showOpenLabelCheckbox) {
        showOpenLabelCheckbox.addEventListener('change', function () {
            chrome.storage.local.set({ showOpenLabel: showOpenLabelCheckbox.checked });
        });
    }

});

// Tooltip bubble 
document.querySelectorAll('.tooltip-container').forEach(container => {
    const bubble = container.querySelector('.tooltip-bubble');
    if (!bubble) return;

    function positionTooltip() {
        const icon = container.querySelector('.question-icon') || container;
        const rect = icon.getBoundingClientRect();
        const bubbleRect = bubble.getBoundingClientRect();
        const padding = 8;

        let top = rect.top + window.scrollY;
        let left = rect.right + padding + window.scrollX;

        if (left + bubbleRect.width > window.innerWidth - 10) {
            left = rect.left - bubbleRect.width - padding + window.scrollX;
        }
        if (left < 8) left = 8;
        if (top + bubbleRect.height > window.innerHeight - 10) {
            top = rect.top - bubbleRect.height - padding + window.scrollY;
        }
        if (top < 8) top = 8;

        bubble.style.left = left + 'px';
        bubble.style.top = top + 'px';
    }

    container.addEventListener('mouseenter', positionTooltip);
    container.addEventListener('focusin', positionTooltip);
    container.addEventListener('mousemove', positionTooltip);
    container.addEventListener('mouseleave', () => {
        bubble.style.left = '';
        bubble.style.top = '';
    });
    container.addEventListener('focusout', () => {
        bubble.style.left = '';
        bubble.style.top = '';
    });
});

// Radio button click handlers with toggle functionality
document.querySelectorAll('input[name="timeframe"]').forEach(radio => {
    radio.addEventListener('click', function () {
        if (this.dataset.wasChecked === 'true') {
            this.checked = false;
            this.dataset.wasChecked = 'false';

            const startDateInput = document.getElementById('startingDate');
            const endDateInput = document.getElementById('endingDate');
            startDateInput.readOnly = false;
            endDateInput.readOnly = false;

            chrome.storage.local.set({
                lastWeekContribution: false,
                yesterdayContribution: false,
                selectedTimeframe: null
            });
        } else {
            document.querySelectorAll('input[name="timeframe"]').forEach(r => {
                r.dataset.wasChecked = 'false';
            });
            this.dataset.wasChecked = 'true';
            toggleRadio(this);
        }
    });
});

// refresh cache button
document.getElementById('refreshCache').addEventListener('click', async function () {
    const button = this;
    const originalText = button.innerHTML;

    button.classList.add('loading');
    button.innerHTML = '<i class="fa fa-refresh fa-spin"></i><span>Refreshing...</span>';
    button.disabled = true;

    try {
        // Clear local cache
        await forceGithubDataRefresh();

        // Clear the scrum report
        const scrumReport = document.getElementById('scrumReport');
        if (scrumReport) {
            scrumReport.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">Cache cleared successfully. Click "Generate Report" to fetch fresh data.</p>';
        }

        button.innerHTML = '<i class="fa fa-check"></i><span>Cache Cleared!</span>';
        button.classList.remove('loading');

        setTimeout(() => {
            button.innerHTML = originalText;
            button.disabled = false;
        }, 2000);

    } catch (error) {
        console.error('Cache clear failed:', error);
        button.innerHTML = '<i class="fa fa-exclamation-triangle"></i><span>Failed to clear cache</span>';
        button.classList.remove('loading');

        setTimeout(() => {
            button.innerHTML = originalText;
            button.disabled = false;
        }, 3000);
    }
});

function toggleRadio(radio) {
    const startDateInput = document.getElementById('startingDate');
    const endDateInput = document.getElementById('endingDate');

    console.log('Toggling radio:', radio.id);

    if (radio.id === 'lastWeekContribution') {
        startDateInput.value = getLastWeek();
        endDateInput.value = getToday();
    } else if (radio.id === 'yesterdayContribution') {
        startDateInput.value = getYesterday();
        endDateInput.value = getToday();
    }

    startDateInput.readOnly = endDateInput.readOnly = true;

    chrome.storage.local.set({
        startingDate: startDateInput.value,
        endingDate: endDateInput.value,
        lastWeekContribution: radio.id === 'lastWeekContribution',
        yesterdayContribution: radio.id === 'yesterdayContribution',
        selectedTimeframe: radio.id,
        githubCache: null // Clear cache to force new fetch
    }, () => {
        console.log('State saved, dates:', {
            start: startDateInput.value,
            end: endDateInput.value,
            isLastWeek: radio.id === 'lastWeekContribution'
        });
    });
}