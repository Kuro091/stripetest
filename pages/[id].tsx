import { supabase } from '@/utils/supabase';
import { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';

const LessonsDetails = ({ lesson }: { lesson: any }) => {
  const [videoUrl, setVideoUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    const getPremiumContent = async () => {
      const { data: premiumContent } = await supabase
        .from('premium_content')
        .select('*')
        .eq('id', lesson.id)
        .single();

      setVideoUrl(premiumContent?.video_url);
    };

    getPremiumContent();
  }, [lesson]);

  return (
    <div className='mt-10 flex flex-col items-center justify-center w-full border-2 border-gray-200 rounded-xl p-8'>
      <h2 className='text-2xl font-bold'>{lesson.title}</h2>
      <p className='text-xl'>{lesson.desc}</p>
      {videoUrl && <ReactPlayer url={videoUrl} />}
    </div>
  );
};

export const getStaticPaths = async () => {
  const { data: lessons } = await supabase.from('lessons').select('id');

  const paths = lessons?.map(({ id }) => ({
    params: { id: id.toString() },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async ({
  params,
}: {
  params: {
    id: string;
  };
}) => {
  const { data: lesson } = await supabase.from('lessons').select('*').eq('id', params.id).single();

  return {
    props: {
      lesson,
    },
  };
};

export default LessonsDetails;
