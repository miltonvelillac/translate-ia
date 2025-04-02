let translateButton = document.querySelector('#translateButton');

translateButton.addEventListener('click', async(event) => {
  event.preventDefault();
  let inputText = getInputtext();
  const text = inputText.value.trim();

  const targetlang = getTargetlanguage().value.trim();
  if(!text) return;

  const messagesContainer = getMessageContainer();
  addUserMessage(messagesContainer, text);

  try {
    disableTranslateButton(translateButton);
    disableInputText(inputText);
    const response = await fetch('/api/translate', {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        text,
        targetlang
      })
    });

    const data = await response.json();
    addTranslatedText(data, messagesContainer);
    enableTranslateButton(translateButton);
    enableInputText(inputText);

  } catch (error) {
    console.error(error);
  }

  inputText.value = "";

});

function getInputtext() {
  return document.querySelector('#inputText');
}

function getTargetlanguage() {
  return document.querySelector('#targetLang');
}

function getMessageContainer() {
  return document.querySelector('.chat__messages');
}

function addUserMessage(messagesContainer, text) {
  const userMessage = document.createElement('div');
  userMessage.className = 'chat__message chat__message--user';
  userMessage.textContent = text;

  messagesContainer.appendChild(userMessage);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

async function addTranslatedText(data, messagesContainer) {
  const botMessage = document.createElement("div");
  botMessage.className = "chat__message chat__message--bot";
  botMessage.textContent = data.translatedText;
  messagesContainer.appendChild(botMessage);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function enableTranslateButton(button) {
  button.textContent = 'Translate';
  button.disabled = false;
}

function disableTranslateButton(button) {
  button.textContent = 'Loading...';
  button.disabled = true;
}

function disableInputText(input) {
  input.disabled = true;
}

function enableInputText(input) {
  input.disabled = false;
}
