// Определяем тип для пресетов
export const ENVIRONMENT_FILES = {
    city: '/environments/potsdamer_platz_2k.hdr',
    studio: '/environments/studio_small_08_2k.hdr'
  } as const;
  
  // Функция предзагрузки HDR файлов
  export const preloadEnvironments = () => {
    return Promise.all(
      Object.values(ENVIRONMENT_FILES).map(url =>
        fetch(url).then(response => response.blob())
      )
    );
  };