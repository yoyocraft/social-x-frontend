import { uploadImageUsingPost } from '@/services/socialx/mediaResourceController';
import gfm from '@bytemd/plugin-gfm';
import highlight from '@bytemd/plugin-highlight';
import { Editor } from '@bytemd/react';
import 'bytemd/dist/index.css';
import 'github-markdown-css/github-markdown-light.css';
import 'highlight.js/styles/vs.css';
import './index.css';

interface Props {
  value?: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  source: string;
}

const plugins = [gfm(), highlight()];

const MdEditor = (props: Props) => {
  const { value = '', onChange, placeholder, source } = props;

  const onUploadImagesHandle = async (files: File[]): Promise<Pick<any, 'title' | 'url'>[]> => {
    const list: { title: string; url: string }[] = [];
    const res = await uploadImageUsingPost(
      {
        source,
      },
      {},
      files[0],
    );
    const fullPath = res.data?.accessUrl ?? '';
    list.push({ title: files[0].name, url: fullPath });
    return Promise.resolve(list);
  };

  return (
    <div className="md-editor">
      <Editor
        value={value}
        placeholder={placeholder}
        plugins={plugins}
        onChange={onChange}
        uploadImages={onUploadImagesHandle}
      />
    </div>
  );
};

export default MdEditor;
