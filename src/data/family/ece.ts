import type { FamilyMember } from '../../types/family';

/*
liya-ece: kız bebek
anne-nihal: nihal
baba-salih: salih
osman-dede: osman
aysel-babaanne: aysel
rasim-dede: rasim
goncagül-anneanne: goncagül
ayşe-hala: ayşe
filiz-teyze: filiz
muhammed-emin-dayı: muhammed-emin
muhammet-amca: muhammet
adem-amca: adem
ali-amca: ali
erkan-dede: erkan
hasan-abi: hasan
hüseyin-abi: huseyin
taha-abi: taha
öykü-mina-abla: öykü-mina
masal-ada-abla: masal-ada
çınar-abi: çınar
miraç-kardeş: miraç
miray-su-abla: miray-su
kerem-ali-kardeş: kerem-ali
merve-abla: merve
rümeysa-abla: rümeysa
umay-kardeş: umay
aymira-kardeş: aymira
*/

export const eceFamilyMembers: FamilyMember[] = [
  {
    id: 'liya-ece',
    name: 'Liya Ece',
    emoji: '👶',
    photos: [
      require('../../../assets/images/family/liya-ece1.jpg'),
      require('../../../assets/images/family/liya-ece2.jpg'),
      require('../../../assets/images/family/liya-ece3.jpg'),
    ],
  },
  {
    id: 'anne-nihal',
    name: 'Nihal',
    emoji: '👩',
    photos: [
      require('../../../assets/images/family/anne1.jpg'),
      require('../../../assets/images/family/anne2.jpg'),
      require('../../../assets/images/family/anne3.jpg'),
    ],
  },
  // {
  //     id: 'baba-salih',
  //     name: 'Salih',
  //     emoji: '👨',
  //     photos: [
  //         require('../../../assets/images/family/baba1.jpg'),
  //         require('../../../assets/images/family/baba2.jpg'),
  //         require('../../../assets/images/family/baba3.jpg'),
  //     ],
  // },
  // {
  //     id: 'osman-dede',
  //     name: 'Osman',
  //     emoji: '👴',
  //     photos: [
  //         require('../../../assets/images/family/osman-dede1.png'),
  //         require('../../../assets/images/family/osman-dede2.png'),
  //         require('../../../assets/images/family/osman-dede3.png'),
  //     ],
  // },
  // {
  //     id: 'aysel-babaanne',
  //     name: 'Aysel',
  //     emoji: '👵',
  //     photos: [
  //         require('../../../assets/images/family/aysel-babaanne1.png'),
  //         require('../../../assets/images/family/aysel-babaanne2.png'),
  //         require('../../../assets/images/family/aysel-babaanne3.png'),
  //     ],
  // },
  // {
  //     id: 'rasim-dede',
  //     name: 'Rasim',
  //     emoji: '👴',
  //     photos: [
  //         require('../../../assets/images/family/rasim-dede1.png'),
  //         require('../../../assets/images/family/rasim-dede2.png'),
  //         require('../../../assets/images/family/rasim-dede3.png'),
  //     ],
  // },
  // {
  //     id: 'goncagül-anneanne',
  //     name: 'Goncagül',
  //     emoji: '👵',
  //     photos: [
  //         require('../../../assets/images/family/goncagül-anneanne1.png'),
  //         require('../../../assets/images/family/goncagül-anneanne2.png'),
  //         require('../../../assets/images/family/goncagül-anneanne3.png'),
  //     ],
  // },
  // {
  //     id: 'ayşe-hala',
  //     name: 'Ayşe',
  //     emoji: '👩',
  //     photos: [
  //         require('../../../assets/images/family/ayşe-hala1.png'),
  //         require('../../../assets/images/family/ayşe-hala2.png'),
  //         require('../../../assets/images/family/ayşe-hala3.png'),
  //     ],
  // },
  // {
  //     id: 'filiz-teyze',
  //     name: 'Filiz',
  //     emoji: '👩',
  //     photos: [
  //         require('../../../assets/images/family/filiz-teyze1.png'),
  //         require('../../../assets/images/family/filiz-teyze2.png'),
  //         require('../../../assets/images/family/filiz-teyze3.png'),
  //     ],
  // },
  // {
  //     id: 'muhammed-emin-dayi',
  //     name: 'Muhammed Emin',
  //     emoji: '👨',
  //     photos: [
  //         require('../../../assets/images/family/muhammed-emin-dayi1.png'),
  //         require('../../../assets/images/family/muhammed-emin-dayi2.png'),
  //         require('../../../assets/images/family/muhammed-emin-dayi3.png'),
  //     ],
  // },
  // {
  //     id: 'muhammet-amca',
  //     name: 'Muhammet',
  //     emoji: '👨',
  //     photos: [
  //         require('../../../assets/images/family/muhammet-amca1.png'),
  //         require('../../../assets/images/family/muhammet-amca2.png'),
  //         require('../../../assets/images/family/muhammet-amca3.png'),
  //     ],
  // },
  // {
  //     id: 'adem-amca',
  //     name: 'Adem',
  //     emoji: '👨',
  //     photos: [
  //         require('../../../assets/images/family/adem-amca1.png'),
  //         require('../../../assets/images/family/adem-amca2.png'),
  //         require('../../../assets/images/family/adem-amca3.png'),
  //     ],
  // },
  // {
  //     id: 'ali-amca',
  //     name: 'Ali',
  //     emoji: '👨',
  //     photos: [
  //         require('../../../assets/images/family/ali-amca1.png'),
  //         require('../../../assets/images/family/ali-amca2.png'),
  //         require('../../../assets/images/family/ali-amca3.png'),
  //     ],
  // },
  // {
  //     id: 'erkan-dede',
  //     name: 'Erkan',
  //     emoji: '👴',
  //     photos: [
  //         require('../../../assets/images/family/erkan-dede1.png'),
  //         require('../../../assets/images/family/erkan-dede2.png'),
  //         require('../../../assets/images/family/erkan-dede3.png'),
  //     ],
  // },
  // {
  //     id: 'hasan-abi',
  //     name: 'Hasan',
  //     emoji: '👨',
  //     photos: [
  //         require('../../../assets/images/family/hasan-abi1.png'),
  //         require('../../../assets/images/family/hasan-abi2.png'),
  //         require('../../../assets/images/family/hasan-abi3.png'),
  //     ],
  // },
  // {
  //     id: 'hüseyin-abi',
  //     name: 'Hüseyin',
  //     emoji: '👨',
  //     photos: [
  //         require('../../../assets/images/family/hüseyin-abi1.png'),
  //         require('../../../assets/images/family/hüseyin-abi2.png'),
  //         require('../../../assets/images/family/hüseyin-abi3.png'),
  //     ],
  // },
  // {
  //     id: 'taha-abi',
  //     name: 'Taha',
  //     emoji: '👨',
  //     photos: [
  //         require('../../../assets/images/family/taha-abi1.png'),
  //         require('../../../assets/images/family/taha-abi2.png'),
  //         require('../../../assets/images/family/taha-abi3.png'),
  //     ],
  // },
  // {
  //     id: 'öykü-mina-abla',
  //     name: 'Öykü Mina',
  //     emoji: '👩',
  //     photos: [
  //         require('../../../assets/images/family/öykü-mina-abla1.png'),
  //         require('../../../assets/images/family/öykü-mina-abla2.png'),
  //         require('../../../assets/images/family/öykü-mina-abla3.png'),
  //     ],
  // },
  // {
  //     id: 'masal-ada-abla',
  //     name: 'Masal Ada',
  //     emoji: '👩',
  //     photos: [
  //         require('../../../assets/images/family/masal-ada-abla1.png'),
  //         require('../../../assets/images/family/masal-ada-abla2.png'),
  //         require('../../../assets/images/family/masal-ada-abla3.png'),
  //     ],
  // },
];
