const productCatalog = {
  1: {
    category: 'Racing',
    description:
      'Nacido para buscar el límite en cada curva. Una interpretación de competición del 911 que lleva el ADN de Porsche directamente al circuito, ahora reducido a escala 1:64 para ocupar un lugar en tu colección.',
    boxedImage: '/img/boxed/caja-porsche-911-gt3-r.png',
  },
  2: {
    category: 'Racing',
    description:
      'Un icono de la vieja escuela que todavía impone respeto. Su silueta compacta, actitud de competición y estética de finales de los 80 lo convierten en una pieza imprescindible para cualquier garage.',
    boxedImage: '/img/boxed/caja-bmw-m3-e30.png',
  },
  3: {
    category: 'Racing',
    description:
      'Azul, dorado y listo para atacar el siguiente tramo. Una de las combinaciones más reconocibles de la cultura rally, reinterpretada en 1:64 con toda la actitud de los grandes años de Subaru en competición.',
    boxedImage: '/img/boxed/caja-subaru-impresa-wrx-sti-gdb.png',
  },
  4: {
    category: 'Racing',
    description:
      'Una leyenda de los tramos que no necesitaba presentación. Inspirado en el Delta que llevó a Lancia a conquistar los rallies de finales de los 80, con la esencia de aquella época concentrada en una miniatura.',
    boxedImage: '/img/boxed/caja-lancia-delta-hf-integrale-v8.png',
  },

  5: {
    category: 'Supercars',
    description:
      'El F40, pero sin techo y con todavía menos razones para pasar desapercibido. Una interpretación abierta de uno de los supercars más emblemáticos de Ferrari, pensada para destacar tanto en la carretera como en la vitrina.',
    boxedImage: '/img/boxed/caja-ferrari-f40-spider.png',
  },
  6: {
    category: 'Supercars',
    description:
      'Ángulos, presencia y cero intención de pasar desapercibido. El Countach llevó la idea de supercar italiano hasta el extremo y sigue teniendo la misma capacidad de detener miradas décadas después.',
    boxedImage: '/img/boxed/caja.lamborghini-countach-5000-qv.png',
  },
  7: {
    category: 'Supercars',
    description:
      'Verde, Nº50 y nacido para las largas noches de Le Mans. Una pieza que captura la época dorada de los GT de resistencia y la convierte en una pequeña joya para coleccionistas.',
    boxedImage: '/img/boxed/caja-mclaren-f1-gtr-50-jacadi.png',
  },
  8: {
    category: 'Supercars',
    description:
      'Cuando la tecnología también aprendió a ser brutal. El 918 combina prestaciones de hypercar con una mirada adelantada a su tiempo, convertido aquí en una pieza de 1:64 para colecciones que miran hacia el futuro.',
    boxedImage: '/img/boxed/caja-porsche-918-spyder.png',
  },

  9: {
    category: 'Street / Tuning',
    description:
      'Pequeño de tamaño. Grande de actitud. Una base de culto para la cultura tuning que aquí recibe el tratamiento ColdWheels: bajo, ancho y preparado para salir del garage directo a la calle.',
    boxedImage: '/img/boxed/caja-volkswagen-fox-mk1.png',
  },
  10: {
    category: 'Street / Tuning',
    description:
      'Hecho para la ciudad. Preparado para llamar la atención. El Silvia S15 representa esa época en la que un coupé japonés, unas buenas llantas y un poco de actitud podían convertirse en algo mucho más especial.',
    boxedImage: '/img/boxed/caja-nissan-silvia-s15.png',
  },
  11: {
    category: 'Street / Tuning',
    description:
      'Ligero, pequeño y con ganas de guerra. El EK9 convirtió un compacto en una referencia para toda una generación de aficionados al JDM y sigue transmitiendo esa misma energía en escala 1:64.',
    boxedImage: '/img/boxed/caja-honda-civic-type-r-ek9.png',
  },
  12: {
    category: 'Street / Tuning',
    description:
      'Curvas limpias, motor diferente y una personalidad imposible de confundir. El RX-7 FD es puro espíritu japonés de los 90, reinterpretado como una pieza de garage para quienes saben que no todo tiene que parecerse a lo demás.',
    boxedImage: '/img/boxed/caja-mazda-rx-7-fd.png',
  },

  13: {
    category: 'Classics',
    description:
      'La silueta que ayudó a definir una época. Largo, bajo y con ese inconfundible perfil fastback, el Mustang de 1967 trae a ColdWheels una dosis de pura cultura automovilística americana.',
    boxedImage: '/img/boxed/caja-ford-mustang-fastback.png',
  },
  14: {
    category: 'Classics',
    description:
      'Músculo americano en estado puro. El Camaro SS combina una carrocería que no pasa desapercibida con esa actitud de finales de los 60 que convirtió a los muscle cars en auténticos iconos.',
    boxedImage: '/img/boxed/caja-chevrolet-camaro-ss.png',
  },
  15: {
    category: 'Classics',
    description:
      'La fórmula era sencilla: poco tamaño, mucho carácter. El primer GTI convirtió al Golf en algo más que un compacto y puso las bases de una categoría que todavía sigue viva.',
    boxedImage: '/img/boxed/caja-volkswagen-golf-gti-mk1.png',
  },
  16: {
    category: 'Classics',
    description:
      'Antes de que existieran las etiquetas modernas, ya había coches así. Compacto, ligero y con carácter deportivo, el BMW 2002 representa una época en la que conducir era parte importante de la experiencia.',
    boxedImage: '/img/boxed/caja-bmw-2002.png',
  },

  17: {
    category: 'Off-Road / Utility',
    description:
      'Donde termina el asfalto, empieza su territorio. El FJ40 nació para trabajar, explorar y seguir adelante cuando el camino dejaba de existir, convirtiéndose con el tiempo en un icono del 4x4 clásico.',
    boxedImage: '/img/boxed/caja-toyota-fj40.png',
  },
  18: {
    category: 'Off-Road / Utility',
    description:
      'Menos carretera. Más aventura. El Wrangler Rubicon lleva la filosofía Jeep al terreno donde realmente se siente cómodo: barro, piedras, desniveles y cualquier camino que decida ponerse difícil.',
    boxedImage: '/img/boxed/caja-jeep-wrangler-rubicon.png',
  },
  19: {
    category: 'Off-Road / Utility',
    description:
      'Diseñado para salir de la carretera y no mirar atrás. El Bronco original combina la sencillez de un 4x4 clásico con una presencia que todavía encaja perfectamente en un garage de hoy.',
    boxedImage: '/img/boxed/caja-ford-bronco.png',
  },
  20: {
    category: 'Off-Road / Utility',
    description:
      'Grande, rápida y construida para jugar fuera del asfalto. La Raptor lleva la idea de pickup todoterreno a otro nivel, mezclando fuerza, suspensión de alto recorrido y una actitud que pide terreno abierto.',
    boxedImage: '/img/boxed/caja-ford-f-150-raptor-2025.png',
  },
};

export default productCatalog;
