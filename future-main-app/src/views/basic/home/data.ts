import growIcon1 from '@/assets/images/home/grow-icon1.png';
import growIcon2 from '@/assets/images/home/grow-icon2.png';
import growIcon3 from '@/assets/images/home/grow-icon3.png';
import growIcon4 from '@/assets/images/home/grow-icon4.png';
import growImg1 from '@/assets/images/home/grow-img1.png';
import growImg2 from '@/assets/images/home/grow-img2.png';
import growImg3 from '@/assets/images/home/grow-img3.png';
import growImg4 from '@/assets/images/home/grow-img4.png';

export interface GrowCardItem {
  icon: string;
  mainImg: string;
  title: string;
  value: number;
  total: number;
  color: string;
  bg: string;
  tagBg: string;
  action: string;
}

export const growCardList: GrowCardItem[] = [
  {
    title: '访问数',
    icon: growIcon1,
    mainImg: growImg1,
    value: 2000,
    total: 120000,
    color: '#21AD82',
    tagBg: 'rgba(33,173,130,0.1)',
    bg: 'linear-gradient(58deg, #F7FFFE 0%, #E7FFFE 67%, #E2FCF8 100%)',
    action: '月',
  },
  {
    title: '成交额',
    icon: growIcon2,
    mainImg: growImg2,
    value: 20000,
    total: 500000,
    color: '#CD7326',
    tagBg: 'rgba(205,115,38,0.1)',
    bg: 'linear-gradient(58deg, #FFFCF4 0%, #FFF9F4 67%, #FFE2D0 100%)',
    action: '月',
  },
  {
    title: '下载数',
    icon: growIcon3,
    mainImg: growImg3,
    value: 8000,
    total: 120000,
    color: '#294DE5',
    tagBg: 'rgba(41,70,229,0.1)',
    bg: 'linear-gradient(58deg, #F7FAFF 0%, #EFF5FF 67%, #D0E0FD 100%)',
    action: '周',
  },
  {
    title: '成交数',
    icon: growIcon4,
    mainImg: growImg4,
    value: 5000,
    total: 50000,
    color: '#2F92E6',
    tagBg: 'rgba(41,128,229,0.1)',
    bg: 'linear-gradient(58deg, #F5F8FF 0%, #EFF6FF 67%, #D0E6FD 100%)',
    action: '年',
  },
];
