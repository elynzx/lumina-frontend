interface Props {
  title: string
  description: string
}

export const Card = ({
  title,
  description
}: Props) => {

  return (
    <div className="w-[260px] h-[345px] bg-gray flex flex-col justify-end shadow-xl rounded-lg">
      <div className="mb-14">
        <h3 className="card-title">{title}</h3>
        <p className="card-description">{description}</p>
      </div>
    </div>
  )
};
