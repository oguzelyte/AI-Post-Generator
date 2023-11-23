import config from '../config/config.json' assert { type: 'json' };

async function getPromptModule() {
  const promptModuleName = `../config/prompts/${config.promptFile}.js`;

  try {
    const promptModule = await import(promptModuleName);
    return promptModule;
  } catch (error) {
    console.error('Error importing prompt module:', error);
    throw new Error('Failed to import prompt module');
  }
}

export { getPromptModule };
