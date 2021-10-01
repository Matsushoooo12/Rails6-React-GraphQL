module Mutations
  class UpdatePost < BaseMutation
    graphql_name 'UpdatePost'

    field :post, Types::PostType, null: false

    argument :id, ID, required: true
    argument :title, String, required: false

    def resolve(**args)
      post = Post.find(args[:id])
      post.update(title: args[:title])
      {
        post: post
      }
    end
  end
end
