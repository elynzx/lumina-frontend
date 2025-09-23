interface Props {
  title: string
  description: string
  imgUrl: string
  onClick?: () => void
}

export const CategoryCard = ({
  title,
  description,
  imgUrl,
  onClick
}: Props) => {

  return (
    <div
      className="w-[260px] h-[345px] flex flex-col justify-end shadow-xl rounded-xl bg-cover bg-center relative overflow-hidden transition-transform duration-300 ease-in-out hover:scale-105"
      style={{ backgroundImage: `url(${imgUrl})` }} onClick={onClick}
    > 
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.05) 60%, rgba(0,0,0,0.7) 100%)"
        }}
      />
      <div className="mb-10 relative z-10">
        <h3 className="card-title text-white">{title}</h3>
        <p className="card-description text-white">{description}</p>
      </div>
    </div>
  )
};


