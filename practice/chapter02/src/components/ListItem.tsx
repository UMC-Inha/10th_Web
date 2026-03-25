type Tech = 'REACT' | 'NEXT' | 'VUE' | 'SVELTE' | 'ANGULAR' | 'REACT-NATIVE';

interface ListItemProps {
  tech: Tech;
}

const ListItem = ({ tech }: ListItemProps) => {
  return (
    <li style={{ listStyle: 'none' }}>{tech === 'REACT' ? '고구마와 함께하는 리액트' : tech}</li>
  );
};

export default ListItem;
