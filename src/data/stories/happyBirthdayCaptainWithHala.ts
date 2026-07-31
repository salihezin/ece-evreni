import { Story } from '../../types/story';

const basePath = '../../../assets/images/stories/happyBirthdayCaptainWithHala';
const fileExtension = '.png';

export const happyBirthdayCaptainWithHala: Story = {
    id: 'happy-birthday-captain-with-hala',
    title: 'Minik Kaptan Halası ile Doğum Günü Kutlaması',
    cover: require(`${basePath}1${fileExtension}`),
    pages: [
      {
        text: 'Benim Küçük Kaptanım! 🎉',
        image: require(`${basePath}1${fileExtension}`),
      },
      {
        text: 'Dümen Benim! 🛳️',
        image: require(`${basePath}2${fileExtension}`),
      },
      {
        text: 'Hedef Eğlence Adası! 🏝️',
        image: require(`${basePath}3${fileExtension}`),
      },
      {
        text: 'Halacım İleri. Tamam! 🚀',
        image: require(`${basePath}4${fileExtension}`),
      },
      {
        text: 'AA! Yağmur Korkuttu! 🌧️',
        image: require(`${basePath}5${fileExtension}`),
      },
      {
        text: 'Bu Şemsiye Büyülü! 🌂',
        image: require(`${basePath}6${fileExtension}`),
      },
      {
        text: 'En Güzel Yolculuk Halamla! 🌍',
        image: require(`${basePath}7${fileExtension}`),
      }
    ],
};