import { useState } from "react";

const initialData = {
  title: "",
  description: "",
  mediaURL: "",
  mediaIsImage: false,
}

const CreateExercise: React.FC = () => {
  const [data, setData] = useState(initialData);
  const submitData = () => {}

  const handleInput = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    let name = e.currentTarget.name;
    let value = e.currentTarget.type === "checkbox" ? (e.currentTarget as HTMLInputElement).checked : e.currentTarget.value;
    setData({
      ...data,
      [name]: value,
    })
  }

  return (
    <div>
      <form onSubmit={submitData} >
        <h2>Add new exercise to database</h2>
        <input autoFocus onChange={handleInput} type="text" placeholder="Exercise title" id="title" name="title" />
        <textarea onChange={handleInput} cols={30} placeholder="Exercise description" rows={3} id="description" name="description" />
        <input onChange={handleInput} type="url" placeholder="Exercise image / vide URL" id="mediaURL" name="mediaURL" />
        <input onChange={handleInput} type="checkbox" id="mediaIsImage" name="mediaIsImage" />
        <label htmlFor="mediaIsImage">Is media image?</label><br />
        <div>
          <input disabled={!data.title} type="submit" value="Create" />
        </div>
      </form>
      <style jsx>{`
        .page {
          padding: 3rem;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        input[type='text'],
        textarea {
          width: 100%;
          padding: 0.5rem;
          margin: 0.5rem 0;
          border-radius: 0.25rem;
          border: 0.125rem solid rgba(0, 0, 0, 0.2);
        }

        input[type='submit'] {
          background: #ececec;
          border: 0;
          padding: 1rem 2rem;
        }
      `}</style>
    </div>
  )
}

export default CreateExercise;