// Tập hợp love được chạm
const loveTaps = new Set();
let userName = '';

function startApp() {
  const stageIds = ['cardStage', 'startStage', 'inputStage', 'loveStage'];
  const stages = Object.fromEntries(stageIds.map(id => [id, document.getElementById(id)]));

  if (Object.values(stages).some(stage => !stage)) {
    console.error('Thiếu một trong các element stage!');
    return;
  }

  stages.startStage.style.display = 'none';
  stages.inputStage.style.display = 'block';
  stages.loveStage.style.display = 'none';
  stages.cardStage.style.display = 'none';

  document.getElementById('bgMusic')?.play().catch(err =>
    console.warn('Không thể phát nhạc:', err)
  );

  inipesan();
}

// Hiệu ứng gõ chữ
typeWriterEffect = (text, elementId, callback) => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Không tìm thấy element với ID: ${elementId}`);
    return;
  }

  let i = 0;
  const speed = 50;
  element.textContent = '';

  const type = () => {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    } else {
      console.log('Hiệu ứng gõ hoàn tất');
      callback?.();
    }
  };

  type();
};

function switchStage(fromId, toId, withFade = false) {
  const fromElement = document.getElementById(fromId);
  const toElement = document.getElementById(toId);

  if (!fromElement || !toElement) {
    console.error(`Không tìm thấy element: ${fromId} hoặc ${toId}`);
    return;
  }

  if (withFade) {
    fromElement.classList.add('hidden');
    setTimeout(() => {
      fromElement.style.display = 'none';
      toElement.style.display = 'block';
    }, 1000);
  } else {
    fromElement.style.display = 'none';
    toElement.style.display = 'block';
  }
}

function tapLove(id) {
  if (loveTaps.has(id)) return;

  const loveIcon = document.querySelector(`#loveIcons .love-icon:nth-child(${id})`);
  loveIcon.classList.add('tapped');
  loveTaps.add(id);
  console.log(`Chạm love ${id}, tổng: ${loveTaps.size}`);

  if (loveTaps.size === 4) {
    Swal.fire({
      title: 'Đủ 4 love rồi nè!',
      text: 'Sẵn sàng nhận quà chưa? 💖',
      timer: 1500,
      showConfirmButton: false,
      background: '#fffbe7',
      customClass: { title: 'swal-title', content: 'swal-text' }
    }).then(() => {
      switchStage('loveStage', 'cardStage', true);

      const loveMsg = document.getElementById('loveMsg');
      if (!loveMsg) return console.error('Không tìm thấy element loveMsg!');

      typeWriterEffect(
        `Hôm nay là quốc tế thiếu nhi ! Chúc em bé ${userName} của tớ 1/6 thật vui vẻ hồn nhiên như một đứa trẻ nhưng cũng vẫn phải mạnh mẽ vượt qua mọi khó khăn như một nữ hoàng 👑. Dù cho em có lớn thêm bao nhiêu thì đối với tớ cậu luôn là một công chúa bé bỏng không ai có thể thay thế được💖
`,
      'loveMsg',
        () => {
          const fromTag = document.createElement("div");
          fromTag.id = 'fromTag';
          fromTag.textContent = "𝘊𝘰𝘱𝘺𝘳𝘪𝘨𝘩𝘵: 𝘛𝘩𝘦 𝘈𝘯𝘩";
          fromTag.style.marginTop = "30px";
          fromTag.style.opacity = "0";
          fromTag.style.transition = "opacity 1s ease";
          loveMsg.appendChild(fromTag);

          setTimeout(() => {
            fromTag.style.opacity = "1";
          }, 500);
        }
      );
    });
  }
}

async function inipesan() {
  const { value: typedName } = await Swal.fire({
    title: 'Điền tên của bạn vô đây !!',
    input: 'text',
    inputValue: '',
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: true,
    didOpen: () => Swal.getInput()?.focus(),
    preConfirm: () => Swal.getInput()?.value?.trim()
  });

  if (typedName) {
    userName = typedName;
    loveTaps.clear();
    document.querySelectorAll('.love-icon').forEach(icon =>
      icon.classList.remove('tapped')
    );
    switchStage('inputStage', 'loveStage');
  } else {
    await Swal.fire({
      icon: 'warning',
      title: 'Tên không được để trống!',
      confirmButtonText: 'Nhập lại'
    });
    inipesan();
  }
}
