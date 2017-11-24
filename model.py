from dnn import NeuralNet
from mutable import mutable

import tensorflow as tf
import numpy as np
import argparse
import os

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

@mutable
class NeuralModel:

    help = {
        "device": "use this device",
        "gpu": "use gpu device [0, 1, ...N]",
        "restore": "restore previous model",
        "epoch": "restore model or start training at epoch",
        "net": False
    }

    def __init__(self):
        self.gpu = None
        self.device = None
        self.restore = None
        self.epoch = 0
        self.net = NeuralNet()

    def init(self, restore=None, device=None):

        self.sess = tf.Session(config=tf.ConfigProto(allow_soft_placement=True))

        if device: self.device = device
        if restore: self.restore = restore

        if type(self.gpu) == int:
            self.device = '/gpu:{0}'.format(self.gpu)

        with tf.device(self.device):
            if self.restore:
                self.restore(path=self.restore)
            else:
                self.net.init()
                self.saver = tf.train.Saver()

        self.sess.run(tf.global_variables_initializer())

    def state(self):

        assert(self.sess), 'tf session not initialized'

        graph = tf.get_default_graph()
        collection = tf.get_collection(tf.GraphKeys.TRAINABLE_VARIABLES)

        return [ graph.get_tensor_by_name(x.name).eval(session=self.sess) for x in collection ]

    def restore(self, path=None):

        assert(self.sess), 'tf session not initialized'
        assert(path), 'restore path must be specified'

        self.saver = tf.train.import_meta_graph('{0}.meta'.format(path))
        self.saver.restore(self.sess, path)

        graph = tf.get_default_graph()

        self.X = graph.get_tensor_by_name('in:0')
        self.y = graph.get_tensor_by_name('y:0')

        self.Y = tf.get_collection('out')[0]
        self.loss = tf.get_collection('loss')[0]
        self.optimize = tf.get_collection('optimize')[0]

    def save(self, path=None):

        assert(self.sess), 'tf session not initialized'
        assert(self.saver), 'tf graph saver not initialized'

        if path is None:
            path = 'models'
        if os.path.isdir(path):
            path = '{0}/{1}-e{2}'.format(path, self.net.params.name, self.epoch)

        self.saver.save(self.sess, path)

if __name__ == '__main__':
    nm = NeuralModel(args=True)
    nm.init()

    print "Test"