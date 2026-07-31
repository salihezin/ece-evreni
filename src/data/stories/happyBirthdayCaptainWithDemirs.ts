import { Story } from '../../types/story';

const basePath = '../../../assets/images/stories/happyBirthdayCaptainWithDemirs';
const fileExtension = '.png';

export const happyBirthdayCaptainWithDemirs: Story = {
    id: 'happy-birthday-captain-with-demirs',
    title: 'Minik Kaptan Anneannesi, Dedesi, ve Teyzesi ile Doğum Günü Kutlaması',
    coverEmoji: '🎂',
    pages: [
      {
        text: 'İyi ki doğdun küçük kaptan! 🎉',
        image: require(`${basePath}1${fileExtension}`),
      },
      {
        text: 'Bugün Benim Günüm Anneanne! 🎈',
        image: require(`${basePath}2${fileExtension}`),
      },
      {
        text: 'Mumu üfleyelim teyze! 🕯️',
        image: require(`${basePath}3${fileExtension}`),
      },
      {
        text: 'Büyüyünce Kaptan Olacağım Dedem! 🚀',
        image: require(`${basePath}4${fileExtension}`),
      },
      {
        text: 'Hediyelerimi açıyorum! 🎁. Vayy. Gerçek Dümen! 🛳️',
        image: require(`${basePath}5${fileExtension}`),
      },
      {
        text: 'Rotamız Mutluluk Adası! 🏝️',
        image: require(`${basePath}6${fileExtension}`),
      },
      {
        text: 'Birlikte Her Yere! 🌍',
        image: require(`${basePath}7${fileExtension}`),
      }
    ],
};