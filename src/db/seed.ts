import { getStories, addStory } from './stories';
import { getComics, addComic, addComicPage } from './comics';
import { copyBundledAssetToStorage } from '../utils/assetStorage';

// Metro requires static (non-dynamic) require() calls, so each bundled
// asset is listed explicitly here rather than built from a template path.
const demirsPages = [
  require('../../assets/images/stories/happyBirthdayCaptainWithDemirs1.png'),
  require('../../assets/images/stories/happyBirthdayCaptainWithDemirs2.png'),
  require('../../assets/images/stories/happyBirthdayCaptainWithDemirs3.png'),
  require('../../assets/images/stories/happyBirthdayCaptainWithDemirs4.png'),
  require('../../assets/images/stories/happyBirthdayCaptainWithDemirs5.png'),
  require('../../assets/images/stories/happyBirthdayCaptainWithDemirs6.png'),
  require('../../assets/images/stories/happyBirthdayCaptainWithDemirs7.png'),
];

const halaPages = [
  require('../../assets/images/stories/happyBirthdayCaptainWithHala1.png'),
  require('../../assets/images/stories/happyBirthdayCaptainWithHala2.png'),
  require('../../assets/images/stories/happyBirthdayCaptainWithHala3.png'),
  require('../../assets/images/stories/happyBirthdayCaptainWithHala4.png'),
  require('../../assets/images/stories/happyBirthdayCaptainWithHala5.png'),
  require('../../assets/images/stories/happyBirthdayCaptainWithHala6.png'),
  require('../../assets/images/stories/happyBirthdayCaptainWithHala7.png'),
];

const sharedAudio = require('../../assets/audio/Manifest-Snap-13.mp3');

const demirsPageTexts = [
  'İyi ki doğdun küçük kaptan! 🎉',
  'Bugün Benim Günüm Anneanne! 🎈',
  'Mumu üfleyelim teyze! 🕯️',
  'Büyüyünce Kaptan Olacağım Dedem! 🚀',
  'Hediyelerimi açıyorum! 🎁. Vayy. Gerçek Dümen! 🛳️',
  'Rotamız Mutluluk Adası! 🏝️',
  'Birlikte Her Yere! 🌍',
];

const halaPageTexts = [
  'Benim Küçük Kaptanım! 🎉',
  'Dümen Benim! 🛳️',
  'Hedef Eğlence Adası! 🏝️',
  'Halacım İleri. Tamam! 🚀',
  'AA! Yağmur Korkuttu! 🌧️',
  'Bu Şemsiye Büyülü! 🌂',
  'En Güzel Yolculuk Halamla! 🌍',
];

const seedStoriesIfEmpty = async () => {
  const existing = await getStories();

  if (existing.length > 0) {
    return;
  }

  const demirsCoverPath = await copyBundledAssetToStorage(
    demirsPages[0],
    'stories',
    'happy-birthday-captain-with-demirs-cover.png',
  );
  const demirsAudioPath = await copyBundledAssetToStorage(
    sharedAudio,
    'stories',
    'happy-birthday-captain-with-demirs-audio.mp3',
  );

  await addStory({
    id: 'happy-birthday-captain-with-demirs',
    title:
      'Minik Kaptan Anneannesi, Dedesi, ve Teyzesi ile Doğum Günü Kutlaması',
    description:
      'Minik Kaptan, anneannesi, dedesi ve teyzesi ile birlikte doğum günü kutlaması yapıyor. Bu özel günün tadını çıkarıyorlar.',
    fullStory:
      'Minik Kaptan, anneannesi, dedesi ve teyzesi ile birlikte doğum günü kutlaması yapıyor. Bu özel günün tadını çıkarıyorlar.',
    coverPath: demirsCoverPath,
    audioPath: demirsAudioPath,
  });

  const halaCoverPath = await copyBundledAssetToStorage(
    halaPages[0],
    'stories',
    'happy-birthday-captain-with-hala-cover.png',
  );
  const halaAudioPath = await copyBundledAssetToStorage(
    sharedAudio,
    'stories',
    'happy-birthday-captain-with-hala-audio.mp3',
  );

  await addStory({
    id: 'happy-birthday-captain-with-hala',
    title: 'Minik Kaptan Hala ile Doğum Günü Kutlaması',
    description:
      'Minik Kaptan, Hala ile birlikte doğum günü kutlaması yapıyor. Bu özel günün tadını çıkarıyorlar.',
    fullStory:
      'Minik Kaptan, Hala ile birlikte doğum günü kutlaması yapıyor. Bu özel günün tadını çıkarıyorlar.',
    coverPath: halaCoverPath,
    audioPath: halaAudioPath,
  });
};

const seedComic = async (
  id: string,
  title: string,
  pages: number[],
  texts: string[],
) => {
  const coverPath = await copyBundledAssetToStorage(
    pages[0],
    'comics',
    `${id}-cover.png`,
  );

  await addComic({ id, title, coverPath });

  for (let index = 0; index < pages.length; index++) {
    const imagePath = await copyBundledAssetToStorage(
      pages[index],
      'comics',
      `${id}-page-${index + 1}.png`,
    );

    await addComicPage({
      comicId: id,
      pageOrder: index,
      text: texts[index],
      imagePath,
    });
  }
};

const seedComicsIfEmpty = async () => {
  const existing = await getComics();

  if (existing.length > 0) {
    return;
  }

  await seedComic(
    'happy-birthday-captain-with-demirs',
    'Minik Kaptan Anneannesi, Dedesi, ve Teyzesi ile Doğum Günü Kutlaması',
    demirsPages,
    demirsPageTexts,
  );

  await seedComic(
    'happy-birthday-captain-with-hala',
    'Minik Kaptan Halası ile Doğum Günü Kutlaması',
    halaPages,
    halaPageTexts,
  );
};

export const seedInitialContent = async () => {
  await seedStoriesIfEmpty();
  await seedComicsIfEmpty();
};
