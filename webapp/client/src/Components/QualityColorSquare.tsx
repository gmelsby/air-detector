import { IoIosSquare } from 'react-icons/io';
import { AqiCategory } from '../Utils/AQIUtils';

export default function QualityColorSquare({ currentAqiCategory }: {currentAqiCategory: AqiCategory | undefined}) {
  return <IoIosSquare className={`text-2xl stroke-black ${
    currentAqiCategory === AqiCategory.Good ?
      'text-green-500' :
      currentAqiCategory === AqiCategory.Moderate ?
        'text-yellow-300' :
        currentAqiCategory === AqiCategory.UnhealthyForSensitiveGroups ?
          'text-orange-500' :
          currentAqiCategory === AqiCategory.Unhealthy ?
            'text-red-600' :
            currentAqiCategory === AqiCategory.VeryUnhealthy ?
              'text-purple-700' :
              currentAqiCategory === AqiCategory.Hazardous ?
                'text-amber-900' :
                'text-black'
  }`} />;
}