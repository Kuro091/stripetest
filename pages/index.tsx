import { supabase } from '@/utils/supabase';
import Link from 'next/link';
import { useUser } from './UserContext';

export default function Home({ lessons }: { lessons: any[] }) {
  const { user } = useUser();

  return (
    <main className='flex w-full gap-x-10 min-h-screen  items-center justify-center px-10'>
      {user &&
        lessons.map((lesson) => (
          <Link
            className='p-10 min-h-[15rem] flex flex-col items-center justify-center border-2 border-gray-200 rounded-xl'
            href={`/${lesson.id}`}
            key={lesson.id}
          >
            <h2 className='text-2xl font-bold'>{lesson.title}</h2>
            <p className='text-xl'>{lesson.desc}</p>
          </Link>
        ))}

      {!user && <h1 className='text-2xl font-bold'>Please login to view lessons</h1>}
    </main>
  );
}

export const getServerSideProps = async () => {
  let { data: lessons, error } = await supabase.from('lessons').select('*');
  return {
    props: {
      lessons,
    },
  };
};
