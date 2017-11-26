import tensorflow as tf
import os

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

path = './trained_model/model.ckpt-2000.meta'
sess = tf.Session(config=tf.ConfigProto(allow_soft_placement=True))

with tf.device(None):

    imported_meta = tf.train.import_meta_graph(path)
    imported_meta.restore(sess, tf.train.latest_checkpoint('./trained_model'))

    graph = tf.get_default_graph()

    X = tf.placeholder(tf.float32, shape=(None, 32, 32, 3))
    Y = graph.get_tensor_by_name('ConvNet/out/kernel:0')

    #result = sess.run([Y], feed_dict={X: you_input_vector})
