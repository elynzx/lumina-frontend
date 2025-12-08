interface Props {
  title: string
  description?: string
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
      className="cursor-pointer w-[260px] h-[345px] flex flex-col justify-end shadow-xl rounded-xl bg-cover bg-center relative overflow-hidden card-hover"
      style={{ backgroundImage: `url(${imgUrl})` }} onClick={onClick}
    > 
      <div
        className="absolute inset-0 z-0 transition-all duration-300"
        style={{
          background: "linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.05) 40%, rgba(0,0,0,0.9) 100%)"
        }}
      />
      <div className="mb-8 relative z-10 fade-in-up">
        <h4 className="card-title font-semibold text-white">{title}</h4>
        <p className="card-description text-white px-3">{description}</p>
      </div>
    </div>
  );
};


