function detectGridElements() {
  console.log('🔍 Searching for grid containers...');
  const gridContainers = Array.from(document.querySelectorAll('.gridShow_grid-show-box__1Ej2l'));
  console.log(`📦 Found ${gridContainers.length} grid containers`);
  return gridContainers;
}

function createPiPContent(gridElement) {
  console.log('🎥 Creating PiP content for grid');
  const container = document.createElement('div');
  container.className = 'pip-container';
  
  const pipGrid = gridElement.cloneNode(true);
  pipGrid.className = 'pip-grid';
  
  const originalVideos = gridElement.querySelectorAll('video');
  const clonedVideos = pipGrid.querySelectorAll('video');
  
  originalVideos.forEach((originalVideo, index) => {
    if (originalVideo.srcObject && clonedVideos[index]) {
      clonedVideos[index].srcObject = originalVideo.srcObject;
    }
  });
  
  const controls = document.createElement('div');
  controls.className = 'pip-controls';
  
  const titleLabel = document.createElement('div');
  titleLabel.className = 'pip-camera-name';
  titleLabel.textContent = 'Camera Grid View';
  
  const closeButton = document.createElement('button');
  closeButton.className = 'pip-control-button';
  closeButton.innerHTML = '✕';
  closeButton.onclick = () => document.documentPictureInPicture.window.close();
  
  const resizeButton = document.createElement('button');
  resizeButton.className = 'pip-control-button';
  resizeButton.innerHTML = '⤢';
  resizeButton.onclick = () => {
    const currentWidth = document.documentPictureInPicture.window.innerWidth;
    if (currentWidth === 640) {
      document.documentPictureInPicture.window.resize(800, 600);
    } else {
      document.documentPictureInPicture.window.resize(640, 480);
    }
  };
  
  controls.appendChild(titleLabel);
  controls.appendChild(resizeButton);
  controls.appendChild(closeButton);
  
  container.appendChild(pipGrid);
  container.appendChild(controls);
  
  return container;
}

function injectPiPControls(gridContainer) {
  console.log('💉 Injecting PiP controls into grid items');
  
  const gridItems = gridContainer.querySelectorAll('.gridShow_common-grid-item__2PqNN');
  
  gridItems.forEach((gridItem) => {
    const videoWrapper = gridItem.querySelector('.rtcVideo_rtc-wrapper__12Rdu');
    const videoContainer = gridItem.querySelector('div[style*="position: relative"]');
    const videoElement = gridItem.querySelector('video');
    
    if (!videoWrapper || gridItem.querySelector('.pip-button') || !videoContainer || !videoElement) {
      return;
    }
    
    const pipButton = document.createElement('button');
    pipButton.className = 'pip-button';
    pipButton.innerHTML = 'PiP';
    pipButton.style.position = 'absolute';
    pipButton.style.zIndex = '1000';
    pipButton.style.top = '40px';
    pipButton.style.right = '10px';
    pipButton.style.display = 'none';
    pipButton.style.background = 'rgba(0, 0, 0, 0.5)';
    pipButton.style.color = '#fff';
    pipButton.style.border = 'none';
    pipButton.style.padding = '5px 10px';
    pipButton.style.borderRadius = '4px';
    pipButton.style.cursor = 'pointer';
    pipButton.style.fontSize = '12px';
    
    videoContainer.addEventListener('mouseenter', () => {
      if (videoElement.srcObject) {
        pipButton.style.display = 'block';
      }
    });
    
    videoContainer.addEventListener('mouseleave', () => {
      pipButton.style.display = 'none';
    });
    
    pipButton.addEventListener('click', (e) => {
      e.stopPropagation();
      enablePiPForItem(gridItem);
    });
    
    videoContainer.appendChild(pipButton);
  });
}

async function enablePiPForItem(gridItem) {
  try {
    const deviceName = gridItem.querySelector('.commonTool_device-name__3tXY0')?.textContent || 'Camera';
    console.log('🎬 Enabling PiP for:', deviceName);
    
    const videoElement = gridItem.querySelector('video');
    
    if (!videoElement?.srcObject) {
      throw new Error(`No active video stream found for ${deviceName}`);
    }

    if (document.pictureInPictureElement) {
      await document.exitPictureInPicture();
      if (document.pictureInPictureElement === videoElement) {
        return;
      }
    }
    
    if (document.pictureInPictureEnabled) {
      try {
        await videoElement.requestPictureInPicture();
        console.log('✅ PiP enabled successfully for:', deviceName);
      } catch (pipError) {
        console.error(`Failed to enter Picture-in-Picture mode for ${deviceName}:`, pipError);
        throw pipError;
      }
    } else {
      throw new Error('Picture-in-Picture not supported in this browser');
    }

  } catch (error) {
    console.error('❌ Failed to enter Picture-in-Picture mode:', error);
    alert(error.message);
  }
}

function init() {
  console.log('🚀 Initializing IPC Smart Life Mini-Player extension...');
  
  const gridContainers = detectGridElements();
  console.log(`📊 Found ${gridContainers.length} grid containers`);
  
  gridContainers.forEach(container => {
    injectPiPControls(container);
  });

  console.log('👀 Setting up mutation observer...');
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      const gridContainer = mutation.target.closest('.gridShow_grid-show-box__1Ej2l');
      if (gridContainer) {
        injectPiPControls(gridContainer);
      } else if (mutation.addedNodes.length) {
        const newContainers = detectGridElements();
        newContainers.forEach(container => {
          injectPiPControls(container);
        });
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['style']
  });
  
  console.log('✅ Initialization complete');
}

if (document.readyState === 'loading') {
  console.log('⏳ Waiting for DOM to be ready...');
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}