// type Tech = "REACT" | "NEXT" | "VUE" | "SVELTE" | "ANGULAR" | "REACT-NATIVE";
// 유니온 타입으로 안정성 높이기

interface ListProps {
  // tech: Tech;
  tech: string;
}

const List = ({ tech }: ListProps) => {
  console.log(tech);

  return (
    <li style={{ listStyle: "none" }}>
      {tech === "REACT" ? "똘이와 함께하는 리액트" : tech}
    </li>
  );
};

export default List;
